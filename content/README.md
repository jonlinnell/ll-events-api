# /content
## Description
This directory contains up to 2 files: content, and a metadata JSON file.

If no metadata is provided, a contentType of 'none' will be returned, and the frontend will render a default component.

This is a *temporary* measure while a proper admin solution is implemented.

### content.json
```JSON
{
  "contentType": [image|youtube],
  "content": "<content>"
}
```

### Expected `content` for `contentType`
* 'image' expects a path to a PNG file on the filesystem. Paths are relative to the /content directory
* 'youtube' expects a YouTube video ID, such as 'aQznGdfFPz4' (i.e. the code after ?v= in a YouTube URL.)