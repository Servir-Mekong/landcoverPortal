#!/usr/bin/env python
"""A simple example of connecting to Earth Engine using App Engine."""

import os

import config
import ee
import jinja2
import webapp2

# added
import json
import math

import ast


jinja_environment = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))


class MainPage(webapp2.RequestHandler):

  def get(self):                             # pylint: disable=g-bad-name
    """Request an image from Earth Engine and render it to a web page."""
    
    # initialize the EE
    ee.Initialize(config.EE_CREDENTIALS)

    # get the assemble landuse map
    lcover = ee.Image('projects/servir-mekong/Assemblage/MekongAssemblage_MaxProb_Mode_2015')

	# var PALETTE = [
	#    '6f6f6f', // unknown
	#    'aec3d4', // water
	#    '111149', // mangrove
	#    '387242', // tree (other)
	#    'f4a460', // grass
	#    '800080', // shrub
	#    'cc0013', // built-up
	#    '8dc33b', // crop
	#    'ffff00', // rice
	#    'c3aa69', // plantation
	#    '152106', // tree (deciduous)
	#    '115420', // tree (evergreen)
	#];


    PALETTE_list = '6f6f6f,aec3d4,111149,387242,f4a460,800080,cc0013,8dc33b,ffff00,c3aa69,152106,115420'

    lc_mapid = lcover.getMapId({'min': 0, 'max': 11, 'palette': PALETTE_list}) #'6f6f6f, aec3d4, 111149, 247400, 247400, 247400, 55ff00, 55ff00, a9ff00, a9ff00, a9ff00, 006fff, ffff00, ff0000, ffff00, 74ffe0, e074ff, e074ff'})
    

    # These could be put directly into template.render, but it
    # helps make the script more readable to pull them out here, especially
    # if this is expanded to include more variables.
    template_values = {
        'mapid': lc_mapid['mapid'],
        'token': lc_mapid['token']
    }
    
    
    template = jinja_environment.get_template('index.html')
    self.response.out.write(template.render(template_values))


# Class to update the land cover map
class updateLandCover(webapp2.RequestHandler):

  def get(self):
    
    # get the array with boxes that are checked
    mylegend = self.request.get('lc')
    
    # strip the unicode and put it into an array
    mylegend = mylegend.encode('ascii','ignore').strip("[").strip("]").split(",")
  
    # load the landcover map
    lcover = ee.Image('projects/servir-mekong/Assemblage/MekongAssemblage_MaxProb_Mode_2015')
    
  # var PALETTE = [
	#    '6f6f6f', // unknown
	#    'aec3d4', // water
	#    '111149', // mangrove
	#    '387242', // tree (other)
	#    'f4a460', // grass
	#    '800080', // shrub
	#    'cc0013', // built-up
	#    '8dc33b', // crop
	#    'ffff00', // rice
	#    'c3aa69', // plantation
	#    '152106', // tree (deciduous)
	#    '115420', // tree (evergreen)
	#];


    PALETTE_list = '6f6f6f,aec3d4,111149,387242,f4a460,800080,cc0013,8dc33b,ffff00,c3aa69,152106,115420'

    # create a map with only 0
    mymask = lcover.eq(ee.Number(100))
    
    # enable all checked boxes
    for value in mylegend:
		tempmask = lcover.eq(ee.Number(int(value)))
		mymask = mymask.add(tempmask)
	
    # mask values not in list
    lcover = lcover.updateMask(mymask)

    # get the map id
    lc_mapid = lcover.getMapId({'min': 0, 'max': 11, 'palette': PALETTE_list}) #'6f6f6f, aec3d4, 111149, 247400, 247400, 247400, 55ff00, 55ff00, a9ff00, a9ff00, a9ff00, 006fff, ffff00, ff0000, ffff00, 74ffe0, e074ff, e074ff'})
    
    # set the template as library
    template_values = {
       'eeMapId': lc_mapid['mapid'],
       'eeToken': lc_mapid['token']
    }
    
    # send the result back
    self.response.headers['Content-Type'] = 'application/json'
    self.response.out.write(json.dumps(template_values))    
   



app = webapp2.WSGIApplication([('/', MainPage),
							   ('/updateLandCover',updateLandCover)], debug=True)


###############################################################################
#                           Useful Functions                                  #
###############################################################################

