using System.Security.Cryptography;
using System.Text.Json;
using Windows.Media.Control;
using Windows.Storage.Streams;

static string Clean(string? value) => (value ?? string.Empty).Trim();

static async Task<byte[]> ReadAllBytesAsync(IRandomAccessStream stream)
{
    var bytes = new byte[stream.Size];
    using var input = stream.AsStreamForRead();
    var offset = 0;
    while (offset < bytes.Length)
    {
        var read = await input.ReadAsync(bytes.AsMemory(offset, bytes.Length - offset));
        if (read <= 0) break;
        offset += read;
    }

    if (offset == bytes.Length) return bytes;
    return bytes[..offset];
}

static string ExtensionFor(string? contentType)
{
    var type = (contentType ?? string.Empty).ToLowerInvariant();
    if (type.Contains("png")) return ".png";
    if (type.Contains("webp")) return ".webp";
    if (type.Contains("bmp")) return ".bmp";
    return ".jpg";
}

try
{
    var outputDir = args.Length > 0 && !string.IsNullOrWhiteSpace(args[0])
        ? args[0]
        : Path.Combine(Path.GetTempPath(), "NowPlaying-smtc-covers");
    Directory.CreateDirectory(outputDir);

    var manager = await GlobalSystemMediaTransportControlsSessionManager.RequestAsync();
    var session = manager.GetCurrentSession();
    if (session is null)
    {
        Console.WriteLine(JsonSerializer.Serialize(new { ok = false, url = "", title = "", artist = "", reason = "no-session" }));
        return;
    }

    var properties = await session.TryGetMediaPropertiesAsync();
    var title = Clean(properties.Title);
    var artist = Clean(properties.Artist);
    var album = Clean(properties.AlbumTitle);
    var thumbnail = properties.Thumbnail;
    if (thumbnail is null)
    {
        Console.WriteLine(JsonSerializer.Serialize(new { ok = false, url = "", title, artist, album, reason = "no-thumbnail" }));
        return;
    }

    using var stream = await thumbnail.OpenReadAsync();
    var bytes = await ReadAllBytesAsync(stream);
    if (bytes.Length < 1)
    {
        Console.WriteLine(JsonSerializer.Serialize(new { ok = false, url = "", title, artist, album, reason = "empty-thumbnail" }));
        return;
    }

    var hash = Convert.ToHexString(SHA256.HashData(bytes))[..24].ToLowerInvariant();
    var extension = ExtensionFor(stream.ContentType);
    var path = Path.Combine(outputDir, hash + extension);
    if (!File.Exists(path) || new FileInfo(path).Length != bytes.Length)
    {
        await File.WriteAllBytesAsync(path, bytes);
    }

    Console.WriteLine(JsonSerializer.Serialize(new
    {
        ok = true,
        url = new Uri(path).AbsoluteUri,
        path,
        title,
        artist,
        album,
        contentType = stream.ContentType ?? "",
        bytes = bytes.Length
    }));
}
catch (Exception ex)
{
    Console.WriteLine(JsonSerializer.Serialize(new { ok = false, url = "", reason = ex.GetType().Name + ": " + ex.Message }));
}
