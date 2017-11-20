## All your media files for the production comes in this folder
### These are files uploaded by your user

- In your settings file, set the STATIC_ROOT setting to the directory from which you’d like to serve these files, for example:
```python
MEDIA_URL = '/media/'
MEDIA_ROOT = "/pathto-your-app/media"
```