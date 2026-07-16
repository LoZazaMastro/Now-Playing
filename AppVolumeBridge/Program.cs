using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Text.Json;
using System.Windows.Automation;

internal static class Program
{
    private static string Lower(string? value) => (value ?? string.Empty).Trim().ToLowerInvariant();

    private static string ProcessName(uint pid)
    {
        if (pid == 0) return string.Empty;
        try { return Process.GetProcessById((int)pid).ProcessName; }
        catch { return string.Empty; }
    }

    private static bool Matches(string haystack, IEnumerable<string> names)
    {
        foreach (var name in names)
        {
            var needle = Lower(name);
            if (!string.IsNullOrWhiteSpace(needle) && haystack.Contains(needle)) return true;
        }
        return false;
    }

    private static void Print(object value) => Console.WriteLine(JsonSerializer.Serialize(value));

    [STAThread]
    private static void Main(string[] args)
    {
        try
        {
            if (args.Length > 0 && args[0].Equals("spotify-snapshot", StringComparison.OrdinalIgnoreCase))
            {
                Print(SpotifyAccessibility.Snapshot());
                return;
            }
            if (args.Length > 0 && args[0].Equals("spotify-elements", StringComparison.OrdinalIgnoreCase))
            {
                Print(SpotifyAccessibility.ElementDiagnostics());
                return;
            }
            if (args.Length > 1 && args[0].Equals("spotify-action", StringComparison.OrdinalIgnoreCase))
            {
                Print(SpotifyAccessibility.Action(args[1]));
                return;
            }

            var set = args.Length > 0 && args[0].Equals("set", StringComparison.OrdinalIgnoreCase);
            var listSessions = args.Length > 0 && args[0].Equals("audio-sessions", StringComparison.OrdinalIgnoreCase);
            var volume = 100;
            var nameStart = 1;
            if (set)
            {
                volume = Math.Max(0, Math.Min(100, int.TryParse(args.ElementAtOrDefault(1), out var parsed) ? parsed : 100));
                nameStart = 2;
            }
            else if (args.Length > 0 && args[0].Equals("get", StringComparison.OrdinalIgnoreCase))
            {
                nameStart = 1;
            }

            var names = args.Skip(nameStart).Where(v => !string.IsNullOrWhiteSpace(v)).ToArray();
            var enumerator = (IMMDeviceEnumerator)new MMDeviceEnumerator();
            var hr = enumerator.GetDefaultAudioEndpoint(0, 1, out var device);
            if (hr != 0 || device is null)
            {
                Print(new { ok = false, volume = 100, matched = "", reason = "no-endpoint" });
                return;
            }

            var iid = typeof(IAudioSessionManager2).GUID;
            hr = device.Activate(ref iid, 23, IntPtr.Zero, out var managerPointer);
            if (hr != 0 || managerPointer == IntPtr.Zero)
            {
                Print(new { ok = false, volume = 100, matched = "", reason = "no-manager" });
                return;
            }
            var manager = (IAudioSessionManager2)Marshal.GetObjectForIUnknown(managerPointer);

            hr = manager.GetSessionEnumerator(out var sessions);
            if (hr != 0 || sessions is null)
            {
                Print(new { ok = false, volume = 100, matched = "", reason = "no-sessions" });
                return;
            }

            sessions.GetCount(out var count);
            var matches = new List<(ISimpleAudioVolume Volume, string Label, uint Pid, float Peak)>();
            var diagnostics = new List<object>();
            for (var index = 0; index < count; index++)
            {
                if (sessions.GetSession(index, out var session) != 0 || session is null) continue;
                var control = (IAudioSessionControl2)session;
                control.GetProcessId(out var pid);
                control.GetDisplayName(out var displayName);
                control.GetSessionIdentifier(out var sessionIdentifier);
                control.GetSessionInstanceIdentifier(out var sessionInstanceIdentifier);
                var processName = ProcessName(pid);
                var haystack = Lower(processName + " " + displayName + " " + sessionIdentifier + " " + sessionInstanceIdentifier);
                var peak = 0f;
                try { ((IAudioMeterInformation)session).GetPeakValue(out peak); }
                catch { }
                diagnostics.Add(new { index, processName, displayName, sessionIdentifier, sessionInstanceIdentifier, pid, peak });
                if (!Matches(haystack, names)) continue;

                var simpleVolume = (ISimpleAudioVolume)session;
                var label = (processName + " " + displayName).Trim();
                if (string.IsNullOrWhiteSpace(label)) label = sessionIdentifier;
                matches.Add((simpleVolume, label, pid, peak));
            }

            if (listSessions)
            {
                Print(new { ok = true, count, sessions = diagnostics });
                return;
            }

            if (matches.Count == 0)
            {
                Print(new { ok = false, volume = 100, matched = "", reason = "no-match", count });
                return;
            }

            var eventContext = Guid.Empty;
            if (set)
            {
                foreach (var match in matches)
                    match.Volume.SetMasterVolume(volume / 100f, ref eventContext);
            }
            var active = matches.OrderByDescending(match => match.Peak).ThenByDescending(match => match.Pid != 0).First();
            active.Volume.GetMasterVolume(out var current);
            Print(new
            {
                ok = true,
                volume = (int)Math.Round(Math.Max(0, Math.Min(1, current)) * 100),
                matched = active.Label,
                pid = active.Pid,
                matchedCount = matches.Count,
                sessions = matches.Select(match => new { matched = match.Label, pid = match.Pid, peak = match.Peak }).ToArray()
            });
        }
        catch (Exception ex)
        {
            Print(new { ok = false, volume = 100, matched = "", reason = ex.GetType().Name + ": " + ex.Message });
        }
    }
}

internal static class SpotifyAccessibility
{
    private const byte VkMediaNextTrack = 0xB0;
    private const byte VkMediaPreviousTrack = 0xB1;
    private const byte VkMediaPlayPause = 0xB3;
    private const uint KeyEventKeyUp = 0x0002;

    [DllImport("user32.dll")]
    private static extern void keybd_event(byte virtualKey, byte scanCode, uint flags, UIntPtr extraInfo);

    [DllImport("user32.dll")]
    private static extern IntPtr GetForegroundWindow();

    [DllImport("user32.dll")]
    private static extern bool SetForegroundWindow(IntPtr window);

    [DllImport("user32.dll")]
    private static extern bool BringWindowToTop(IntPtr window);

    [DllImport("user32.dll")]
    private static extern uint GetWindowThreadProcessId(IntPtr window, IntPtr processId);

    [DllImport("kernel32.dll")]
    private static extern uint GetCurrentThreadId();

    [DllImport("user32.dll")]
    private static extern bool AttachThreadInput(uint sourceThread, uint targetThread, bool attach);

    private sealed class State
    {
        public required Process Process { get; init; }
        public required AutomationElement Root { get; init; }
        public required AutomationElement TrackGroup { get; init; }
        public required AutomationElement Controls { get; init; }
        public required string Title { get; init; }
        public required string Artist { get; init; }
        public required string AlbumUri { get; init; }
        public required List<AutomationElement> Buttons { get; init; }
        public AutomationElement? Repeat { get; init; }
        public AutomationElement? Progress { get; init; }
        public bool IsPlaying { get; init; }
        public string ShuffleLabel { get; init; } = string.Empty;
        public string RepeatLabel { get; init; } = string.Empty;
        public bool ShuffleActive { get; init; }
        public string RepeatMode { get; init; } = "Off";
        public long PositionMs { get; init; }
        public long LengthMs { get; init; }
    }

    private static string NameOf(AutomationElement element)
    {
        try { return element.Current.Name?.Trim() ?? string.Empty; }
        catch { return string.Empty; }
    }

    private static bool IsVisible(AutomationElement element)
    {
        try { return !element.Current.IsOffscreen; }
        catch { return false; }
    }

    private static string ValueOf(AutomationElement element)
    {
        try
        {
            return element.TryGetCurrentPattern(ValuePattern.Pattern, out var value)
                ? ((ValuePattern)value).Current.Value ?? string.Empty
                : string.Empty;
        }
        catch { return string.Empty; }
    }

    private static bool ContainsAny(string value, params string[] tokens)
    {
        var normalized = (value ?? string.Empty).ToLowerInvariant();
        return tokens.Any(normalized.Contains);
    }

    private static List<AutomationElement> Elements(AutomationElement parent, ControlType type, bool visibleOnly = true)
    {
        var condition = new PropertyCondition(AutomationElement.ControlTypeProperty, type);
        var found = parent.FindAll(TreeScope.Descendants, condition);
        var result = new List<AutomationElement>(found.Count);
        for (var index = 0; index < found.Count; index++)
            if (!visibleOnly || IsVisible(found[index])) result.Add(found[index]);
        return result;
    }

    private static AutomationElement? FindTrackGroup(AutomationElement root)
    {
        foreach (var group in Elements(root, ControlType.Group))
        {
            var name = NameOf(group);
            if (string.IsNullOrWhiteSpace(name)) continue;
            var links = Elements(group, ControlType.Hyperlink);
            if (links.Count < 2) continue;
            var first = NameOf(links[0]);
            var second = NameOf(links[1]);
            var firstValue = ValueOf(links[0]);
            var secondValue = ValueOf(links[1]);
            if (!firstValue.Contains("/album/", StringComparison.OrdinalIgnoreCase)) continue;
            if (!secondValue.Contains("/artist/", StringComparison.OrdinalIgnoreCase)) continue;
            if (!name.Contains(first, StringComparison.OrdinalIgnoreCase) || !name.Contains(second, StringComparison.OrdinalIgnoreCase)) continue;
            return group;
        }
        return null;
    }

    private static State? ReadState(out string reason)
    {
        reason = string.Empty;
        var process = Process.GetProcessesByName("Spotify").FirstOrDefault(item => item.MainWindowHandle != IntPtr.Zero);
        if (process is null)
        {
            reason = "spotify-window-not-found";
            return null;
        }

        AutomationElement root;
        try { root = AutomationElement.FromHandle(process.MainWindowHandle); }
        catch (Exception exception)
        {
            reason = "automation-root-failed: " + exception.Message;
            return null;
        }

        var trackGroup = FindTrackGroup(root);
        if (trackGroup is null)
        {
            reason = "spotify-accessibility-unavailable";
            return null;
        }
        var links = Elements(trackGroup, ControlType.Hyperlink);
        var title = links.Count > 0 ? NameOf(links[0]) : string.Empty;
        var artist = string.Join(", ", links.Skip(1).Select(NameOf).Where(name => !string.IsNullOrWhiteSpace(name)).Distinct(StringComparer.OrdinalIgnoreCase));
        if (string.IsNullOrWhiteSpace(title) || string.IsNullOrWhiteSpace(artist))
        {
            reason = "spotify-metadata-empty";
            return null;
        }

        var bar = TreeWalker.ControlViewWalker.GetParent(trackGroup) ?? root;
        AutomationElement? controls = null;
        foreach (var group in Elements(bar, ControlType.Group))
        {
            var buttons = Elements(group, ControlType.Button);
            var sliders = Elements(group, ControlType.Slider, false);
            var hasTimeline = sliders.Any(slider =>
            {
                try
                {
                    return slider.TryGetCurrentPattern(RangeValuePattern.Pattern, out var value)
                        && ((RangeValuePattern)value).Current.Maximum > 1000;
                }
                catch { return false; }
            });
            if (buttons.Count >= 4 && hasTimeline)
            {
                controls = group;
                break;
            }
        }
        controls ??= bar;

        var controlButtons = Elements(controls, ControlType.Button);
        if (controlButtons.Count < 4)
        {
            reason = "spotify-controls-unavailable";
            return null;
        }
        controlButtons = controlButtons.Take(4).ToList();
        var repeat = Elements(controls, ControlType.CheckBox, false).FirstOrDefault();
        var progress = Elements(controls, ControlType.Slider, false).FirstOrDefault(slider =>
        {
            try
            {
                return slider.TryGetCurrentPattern(RangeValuePattern.Pattern, out var value)
                    && ((RangeValuePattern)value).Current.Maximum > 1000;
            }
            catch { return false; }
        });

        var playName = NameOf(controlButtons[2]);
        var isPlaying = ContainsAny(playName, "pause", "pausa", "pausar", "pausieren", "пауза", "duraklat", "一時停止", "일시 정지", "暂停");
        var shuffleName = NameOf(controlButtons[0]);
        var shuffleOff = ContainsAny(
            shuffleName,
            "enable shuffle",
            "abilita riproduzione casuale",
            "activer la lecture aléatoire",
            "activar aleatorio",
            "zufallswiedergabe aktivieren",
            "ativar ordem aleatória",
            "включить перемешивание",
            "シャッフルをオン",
            "셔플 사용",
            "开启随机"
        );
        var shuffleActive = !shuffleOff;
        var repeatName = repeat is null ? string.Empty : NameOf(repeat);
        var repeatMode = ContainsAny(repeatName, "disable repeat", "disabilita ripetizione", "désactiver la répétition", "desactivar repetición", "wiederholung deaktivieren")
            ? "Track"
            : ContainsAny(repeatName, "single", "singolo", "unique", "únic", "einzel", "один", "1曲", "한 곡", "单曲")
                ? "List"
                : "Off";

        long position = 0;
        long length = 0;
        if (progress is not null && progress.TryGetCurrentPattern(RangeValuePattern.Pattern, out var rangeValue))
        {
            var range = (RangeValuePattern)rangeValue;
            position = Math.Max(0, (long)Math.Round(range.Current.Value));
            length = Math.Max(0, (long)Math.Round(range.Current.Maximum));
        }

        return new State
        {
            Process = process,
            Root = root,
            TrackGroup = trackGroup,
            Controls = controls,
            Title = title,
            Artist = artist,
            AlbumUri = ValueOf(links[0]),
            Buttons = controlButtons,
            Repeat = repeat,
            Progress = progress,
            IsPlaying = isPlaying,
            ShuffleLabel = shuffleName,
            RepeatLabel = repeat is null ? string.Empty : NameOf(repeat),
            ShuffleActive = shuffleActive,
            RepeatMode = repeatMode,
            PositionMs = position,
            LengthMs = length,
        };
    }

    public static object Snapshot()
    {
        var started = Stopwatch.StartNew();
        var state = ReadState(out var reason);
        if (state is null)
            return new { ok = false, reason, elapsedMs = started.ElapsedMilliseconds, pid = Environment.ProcessId, thread = Environment.CurrentManagedThreadId };

        var id = "spotify-accessibility:" + state.Title + ":" + state.Artist;
        var player = new
        {
            id,
            name = "Spotify",
            sourceAppUserModelId = "Spotify.UIAutomation",
            title = state.Title,
            artist = state.Artist,
            album = "",
            status = state.IsPlaying ? "Playing" : "Paused",
            position = state.PositionMs,
            length = state.LengthMs,
            canNext = true,
            canPrevious = true,
            canPlay = true,
            canPause = true,
            canTogglePlayPause = true,
            canShuffle = true,
            canRepeat = state.Repeat is not null,
            shuffleActive = state.ShuffleActive,
            repeatMode = state.RepeatMode,
            isSelected = true,
            isCurrent = true,
            transport = "spotify-uia",
            albumUri = state.AlbumUri,
        };
        return new
        {
            ok = true,
            selectedPlayer = id,
            currentPlayer = id,
            selected = player,
            players = new[] { player },
            transport = "spotify-uia",
            diagnostics = new
            {
                helperPid = Environment.ProcessId,
                spotifyPid = state.Process.Id,
                spotifySessionId = state.Process.SessionId,
                user = Environment.UserName,
                thread = Environment.CurrentManagedThreadId,
                apartment = Thread.CurrentThread.GetApartmentState().ToString(),
                elapsedMs = started.ElapsedMilliseconds,
                controls = state.Buttons.Select(NameOf).ToArray(),
                repeat = state.Repeat is null ? "" : NameOf(state.Repeat),
            }
        };
    }

    public static object ElementDiagnostics()
    {
        var process = Process.GetProcessesByName("Spotify").FirstOrDefault(item => item.MainWindowHandle != IntPtr.Zero);
        if (process is null) return new { ok = false, reason = "spotify-window-not-found" };
        AutomationElement root;
        try { root = AutomationElement.FromHandle(process.MainWindowHandle); }
        catch (Exception exception) { return new { ok = false, reason = "automation-root-failed: " + exception.Message }; }
        object Describe(AutomationElement element)
        {
            var valueText = ValueOf(element);
            try
            {
                var patterns = element.GetSupportedPatterns()
                    .Select(pattern => new { id = pattern.Id, name = pattern.ProgrammaticName })
                    .ToArray();
                return new
                {
                    name = NameOf(element),
                    automationId = element.Current.AutomationId ?? string.Empty,
                    className = element.Current.ClassName ?? string.Empty,
                    helpText = element.Current.HelpText ?? string.Empty,
                    itemStatus = element.Current.ItemStatus ?? string.Empty,
                    offscreen = element.Current.IsOffscreen,
                    value = valueText,
                    patterns,
                };
            }
            catch
            {
                return new { name = "unavailable", automationId = "", className = "", helpText = "", itemStatus = "", offscreen = true, value = valueText };
            }
        }
        var images = Elements(root, ControlType.Image, false).Take(24).Select(Describe).ToArray();
        var buttons = Elements(root, ControlType.Button, false).Select(Describe).ToArray();
        var checkBoxes = Elements(root, ControlType.CheckBox, false).Select(Describe).ToArray();
        var trackGroup = FindTrackGroup(root);
        var links = trackGroup is null
            ? Array.Empty<object>()
            : Elements(trackGroup, ControlType.Hyperlink, false).Select(Describe).ToArray();
        var ancestors = new List<object>();
        var ancestor = trackGroup;
        for (var depth = 0; ancestor is not null && depth < 5; depth++)
        {
            ancestors.Add(Describe(ancestor));
            ancestor = TreeWalker.ControlViewWalker.GetParent(ancestor);
        }
        return new { ok = true, spotifyPid = process.Id, count = images.Length, images, buttons, checkBoxes, links, ancestors };
    }

    private static bool Invoke(AutomationElement? element)
    {
        if (element is null) return false;
        try
        {
            if (element.TryGetCurrentPattern(InvokePattern.Pattern, out var value))
            {
                ((InvokePattern)value).Invoke();
                return true;
            }
            if (element.TryGetCurrentPattern(TogglePattern.Pattern, out value))
            {
                ((TogglePattern)value).Toggle();
                return true;
            }
            var legacyPattern = AutomationPattern.LookupById(10018);
            if (legacyPattern is not null && element.TryGetCurrentPattern(legacyPattern, out value))
            {
                var method = value.GetType().GetMethod("DoDefaultAction");
                if (method is not null)
                {
                    method.Invoke(value, null);
                    return true;
                }
            }
        }
        catch { }
        return false;
    }

    private static bool SendMediaKey(byte virtualKey)
    {
        try
        {
            keybd_event(virtualKey, 0, 0, UIntPtr.Zero);
            Thread.Sleep(35);
            keybd_event(virtualKey, 0, KeyEventKeyUp, UIntPtr.Zero);
            return true;
        }
        catch { return false; }
    }

    private static bool InvokeWithoutTakingFocus(AutomationElement? element)
    {
        var foreground = GetForegroundWindow();
        var result = Invoke(element);
        if (foreground != IntPtr.Zero && GetForegroundWindow() != foreground)
        {
            var currentThread = GetCurrentThreadId();
            var foregroundThread = GetWindowThreadProcessId(foreground, IntPtr.Zero);
            var attached = foregroundThread != 0 && foregroundThread != currentThread
                && AttachThreadInput(currentThread, foregroundThread, true);
            try
            {
                BringWindowToTop(foreground);
                SetForegroundWindow(foreground);
            }
            finally
            {
                if (attached) AttachThreadInput(currentThread, foregroundThread, false);
            }
        }
        return result;
    }

    public static object Action(string action)
    {
        var state = ReadState(out var reason);
        if (state is null) return new { ok = false, reason };
        var normalized = (action ?? string.Empty).Trim().ToLowerInvariant();
        bool InvokeAndVerify(string kind)
        {
            var before = kind == "shuffle" ? state.ShuffleLabel : state.RepeatLabel;
            for (var attempt = 0; attempt < 2; attempt++)
            {
                var target = kind == "shuffle" ? state.Buttons[0] : state.Repeat;
                if (!InvokeWithoutTakingFocus(target)) return false;
                Thread.Sleep(240);
                var refreshed = ReadState(out _);
                if (refreshed is null) return false;
                var after = kind == "shuffle" ? refreshed.ShuffleLabel : refreshed.RepeatLabel;
                if (!string.Equals(before, after, StringComparison.OrdinalIgnoreCase)) return true;
                state = refreshed;
            }
            return false;
        }

        var ok = normalized switch
        {
            "previous" => SendMediaKey(VkMediaPreviousTrack),
            "next" => SendMediaKey(VkMediaNextTrack),
            "playpause" or "play_pause" => SendMediaKey(VkMediaPlayPause),
            "play" => state.IsPlaying || SendMediaKey(VkMediaPlayPause),
            "pause" => !state.IsPlaying || SendMediaKey(VkMediaPlayPause),
            "shuffle" => InvokeAndVerify("shuffle"),
            "repeat" => InvokeAndVerify("repeat"),
            _ => false,
        };
        var transport = normalized is "previous" or "next" or "playpause" or "play_pause" or "play" or "pause"
            ? "windows-media-key"
            : "spotify-uia-no-focus";
        return new { ok, action = normalized, transport, spotifyPid = state.Process.Id };
    }
}

[ComImport]
[Guid("BCDE0395-E52F-467C-8E3D-C4579291692E")]
internal class MMDeviceEnumerator { }

[ComImport]
[Guid("A95664D2-9614-4F35-A746-DE8DB63617E6")]
[InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
internal interface IMMDeviceEnumerator
{
    int NotImpl1();
    [PreserveSig] int GetDefaultAudioEndpoint(int dataFlow, int role, out IMMDevice device);
}

[ComImport]
[Guid("D666063F-1587-4E43-81F1-B948E807363F")]
[InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
internal interface IMMDevice
{
    [PreserveSig] int Activate(ref Guid iid, int clsCtx, IntPtr activationParams, out IntPtr interfacePointer);
}

[ComImport]
[Guid("77AA99A0-1BD6-484F-8BC7-2C654C9A9B6F")]
[InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
internal interface IAudioSessionManager2
{
    int NotImpl1();
    int NotImpl2();
    [PreserveSig] int GetSessionEnumerator(out IAudioSessionEnumerator sessionEnum);
}

[ComImport]
[Guid("E2F5BB11-0570-40CA-ACDD-3AA01277DEE8")]
[InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
internal interface IAudioSessionEnumerator
{
    [PreserveSig] int GetCount(out int sessionCount);
    [PreserveSig] int GetSession(int sessionCount, out IAudioSessionControl session);
}

[ComImport]
[Guid("F4B1A599-7266-4319-A8CA-E70ACB11E8CD")]
[InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
internal interface IAudioSessionControl
{
    [PreserveSig] int GetState(out int state);
    [PreserveSig] int GetDisplayName([MarshalAs(UnmanagedType.LPWStr)] out string displayName);
    [PreserveSig] int SetDisplayName([MarshalAs(UnmanagedType.LPWStr)] string displayName, ref Guid eventContext);
    [PreserveSig] int GetIconPath([MarshalAs(UnmanagedType.LPWStr)] out string iconPath);
    [PreserveSig] int SetIconPath([MarshalAs(UnmanagedType.LPWStr)] string iconPath, ref Guid eventContext);
    [PreserveSig] int GetGroupingParam(out Guid groupingParam);
    [PreserveSig] int SetGroupingParam(ref Guid groupingParam, ref Guid eventContext);
    [PreserveSig] int RegisterAudioSessionNotification(IntPtr client);
    [PreserveSig] int UnregisterAudioSessionNotification(IntPtr client);
}

[ComImport]
[Guid("bfb7ff88-7239-4fc9-8fa2-07c950be9c6d")]
[InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
internal interface IAudioSessionControl2
{
    [PreserveSig] int GetState(out int state);
    [PreserveSig] int GetDisplayName([MarshalAs(UnmanagedType.LPWStr)] out string displayName);
    [PreserveSig] int SetDisplayName([MarshalAs(UnmanagedType.LPWStr)] string displayName, ref Guid eventContext);
    [PreserveSig] int GetIconPath([MarshalAs(UnmanagedType.LPWStr)] out string iconPath);
    [PreserveSig] int SetIconPath([MarshalAs(UnmanagedType.LPWStr)] string iconPath, ref Guid eventContext);
    [PreserveSig] int GetGroupingParam(out Guid groupingParam);
    [PreserveSig] int SetGroupingParam(ref Guid groupingParam, ref Guid eventContext);
    [PreserveSig] int RegisterAudioSessionNotification(IntPtr client);
    [PreserveSig] int UnregisterAudioSessionNotification(IntPtr client);
    [PreserveSig] int GetSessionIdentifier([MarshalAs(UnmanagedType.LPWStr)] out string sessionIdentifier);
    [PreserveSig] int GetSessionInstanceIdentifier([MarshalAs(UnmanagedType.LPWStr)] out string sessionInstanceIdentifier);
    [PreserveSig] int GetProcessId(out uint processId);
    [PreserveSig] int IsSystemSoundsSession();
    [PreserveSig] int SetDuckingPreference(bool optOut);
}

[ComImport]
[Guid("C02216F6-8C67-4B5B-9D00-D008E73E0064")]
[InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
internal interface IAudioMeterInformation
{
    [PreserveSig] int GetPeakValue(out float peak);
    [PreserveSig] int GetMeteringChannelCount(out int channelCount);
    [PreserveSig] int GetChannelsPeakValues(int channelCount, [Out] float[] peaks);
    [PreserveSig] int QueryHardwareSupport(out int hardwareSupportMask);
}

[ComImport]
[Guid("87CE5498-68D6-44E5-9215-6DA47EF883D8")]
[InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
internal interface ISimpleAudioVolume
{
    [PreserveSig] int SetMasterVolume(float level, ref Guid eventContext);
    [PreserveSig] int GetMasterVolume(out float level);
    [PreserveSig] int SetMute(bool mute, ref Guid eventContext);
    [PreserveSig] int GetMute(out bool mute);
}
