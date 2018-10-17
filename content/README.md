# /content
## Description
Content for the 3x3 screen grid is managed here. `content.json` determines what kind of content is to be displayed, and where to find the content. This directory can also contain, for example, `images/` or `templates/` directories for storing frequently used images and configurations.

If no metadata is provided, a contentType of 'none' will be returned, and the frontend will render a default component.

This is a *temporary* measure while a proper admin solution is implemented.

### content.json
```JSON
{
  "contentType": "image",
  "content": "imageToDisplay.png"
}
```
Or, for a YouTube video...
```JSON
{
  "contentType": "youtube",
  "content": "dQw4w9WgXcQ"
}
```

### Expected `content` for `contentType`
* 'image' expects a path to a PNG file on the filesystem. Paths are relative to the /content directory
* 'youtube' expects a YouTube video ID, such as 'dQw4w9WgXcQ' (i.e. the code after ?v= in a YouTube URL.)
