## All your static files for the production comes in this folder

- In your settings file, set the STATIC_ROOT setting to the directory from which you’d like to serve these files, for example:
```python
STATIC_ROOT = "/pathto-your-app/static"
STATIC_URL = '/static/'
```
### To generate static files, run the collectstatic management command:
```python
$ python manage.py collectstatic
```