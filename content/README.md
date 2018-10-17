# /content
## Description
This directory contains up to 2 files: content, and a metadata JSON file.

If no metadata is provided, a contentType of 'none' will be returned, and the frontend will render a default component.

This is a *temporary* measure while a proper admin solution is implemented.

### content.json
```JSON
{
  "contentType": [image],
  "content": "<content>"
}
```
For `contentType: image` , `content` is expected to be a path to a PNG file on the local filesystem.