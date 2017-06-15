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
    
    # make a palette
    PALETTE_list = '6f6f6f,aec3d4,111149,387242,c3aa69,cc0013,8dc33b,30eb5b,152106,ff4ef8'
  
    # create a map with only 0
    mymask = lcover.eq(ee.Number(100))
    
    # enable all checked boxes
    for value in mylegend:
		tempmask = lcover.eq(ee.Number(int(value)))
		mymask = mymask.add(tempmask)
	
    # mask values not in list
    lcover = lcover.updateMask(mymask)

    # get the map id
    lc_mapid = lcover.getMapId({'min': 0, 'max': 9, 'palette': PALETTE_list}) #'6f6f6f, aec3d4, 111149, 247400, 247400, 247400, 55ff00, 55ff00, a9ff00, a9ff00, a9ff00, 006fff, ffff00, ff0000, ffff00, 74ffe0, e074ff, e074ff'})
    
    # set the template as library
    template_values = {
       'eeMapId': lc_mapid['mapid'],
       'eeToken': lc_mapid['token']
    }
    
    # send the result back
    self.response.headers['Content-Type'] = 'application/json'
    self.response.out.write(json.dumps(template_values))    
   

# get the stats for the different boxes and graph    
class GetStats(webapp2.RequestHandler):

  def get(self):                             
          
    # get the coordinates of the box   
    coordString = self.request.get('param')
    userCoord = ast.literal_eval(coordString)
    poly = ee.Geometry.Polygon(userCoord)
    
    # get the elevation map
    elev = ee.Image('srtm90_v4')
    minmaxElev = elev.reduceRegion(ee.Reducer.minMax(), poly, 200)
    
    # get the max an min value
    minElev = minmaxElev.get('elevation_min').getInfo()
    maxElev = minmaxElev.get('elevation_max').getInfo()

    # create geometry for mekong countries
    country_names = ['Myanmar (Burma)','Thailand','Laos','Vietnam','Cambodia']; 
    countries = ee.FeatureCollection('ft:1tdSwUL7MVpOauSgRzqVTOwdfy17KDbw-1d9omPw');
    mekongCountries = countries.filter(ee.Filter.inList('Country', country_names));
    StudyArea = mekongCountries.geometry();
 
    # import wordpop data
    WorldPop = ee.ImageCollection('WorldPop/POP')
 
    # select relevant countries from worldpop dataset
    WP_2015 = WorldPop.filter(ee.Filter.inList('country', ['MMR','THA','LAO','KHM','VNM'])).filter(ee.Filter.equals('UNadj', 'no')).filter(ee.Filter.equals('year', 2015)).select('population');

    # combine the data
    pop2015e = WP_2015.mosaic() 
    
    # use a reducer to get the sum for worldpop
    popDict = pop2015e.reduceRegion(ee.Reducer.sum(), poly, maxPixels=500000000,scale=1000)
   
    # get the total popuation in the box and make it an integer
    pop = popDict.get('population').getInfo()
    pop = int(pop) 
   
    # convert it into a libray
    obj = {
        'minElev': minElev,
        'maxElev': maxElev,
        'pop': pop
                 
    }

    # send the result back
    self.response.headers['Content-Type'] = 'application/json'
    self.response.out.write(json.dumps(obj))    

class GetLandcover(webapp2.RequestHandler):

  def get(self):                            
    
    # get the polygon coordinates            
    coordString = self.request.get('param')
    userCoord = ast.literal_eval(coordString)
    poly = ee.Geometry.Polygon(userCoord)

    # call the computemodis function to calculate the area per class
    lcStats = ComputeMODISLandcover(poly)
  
    # if this is expanded to include more variables.
    obj = {
         'lcStats': lcStats    
    }

    self.response.headers['Content-Type'] = 'application/json'
    self.response.out.write(json.dumps(obj))    



class GetChirps(webapp2.RequestHandler):

  def get(self):                            
    
    # get coordinates    
    coordString = self.request.get('param')
    userCoord = ast.literal_eval(coordString)
    poly = ee.Geometry.Polygon(userCoord)

    chirpsDataList = ComputeChirpsPPT(poly)      
    
    # These could be put directly into template.render, but it
    # helps make the script more readable to pull them out here, especially
    # if this is expanded to include more variables.
    obj = {
        'chirpsDataList': chirpsDataList              
    }

    self.response.headers['Content-Type'] = 'application/json'
    self.response.out.write(json.dumps(obj))    


class GetWclimTempPPT(webapp2.RequestHandler):

  def get(self):                             # pylint: disable=g-bad-name
          
    #Request an image from Earth Engine and render it to a web page.
    ee.Initialize(config.EE_CREDENTIALS)
        
    coordString = self.request.get('param')
    userCoord = ast.literal_eval(coordString)
    poly = ee.Geometry.Polygon(userCoord)

    pptRaster =  ee.Image('users/sudippradhan/WCLIM_PPT')
    pptDict = pptRaster.reduceRegion(ee.Reducer.mean(), poly, maxPixels=100000000,scale=1000)
    
    
    tmpRaster =  ee.Image('users/sudippradhan/WCLIM_TMEAN')
    tmpDict = tmpRaster.reduceRegion(ee.Reducer.mean(), poly, 1000)

    monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    rasterBands = ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9', 'b10', 'b11', 'b12']

    pptList = []
    tmpList = []

    for bnd in rasterBands:
      pptVal = pptDict.get(bnd).getInfo()
      tmpVal = tmpDict.get(bnd).getInfo()/10 #Wclim temperature is given as a figure multiplied by 10

      pptList.append(round(pptVal,1))
      tmpList.append(round(tmpVal,1))


    # These could be put directly into template.render, but it
    # helps make the script more readable to pull them out here, especially
    # if this is expanded to include more variables.
    obj = {
        #'monthList': monthList,
        'tmpList': tmpList,
        'pptList': pptList
        
        
    }
        

    self.response.headers['Content-Type'] = 'application/json'
    self.response.out.write(json.dumps(obj))





app = webapp2.WSGIApplication([('/', MainPage),
							   ('/getstats', GetStats), 
							   ('/updateLandCover',updateLandCover),
							   ('/getlandcover', GetLandcover), 
							   ('/getchirps', GetChirps), 
							   ('/getwclim', GetWclimTempPPT)], debug=True)




###############################################################################
#                           Useful Functions                                  #
###############################################################################

def ComputeMODISLandcover(poly):

  """Request an image from Earth Engine and render it to a web page."""
  #ee.Initialize(config.EE_CREDENTIALS)
  
  modisLCover = ee.Image('projects/servir-mekong/Assemblage/MekongAssemblage_Mode_2015').select(0)
  
  cclasses = ee.List([0,1,2,3,4,5,6,7,8,9])
  
  cclasses_names = ["0","1","2","3","4","5","6","7","8","9"]


  #Add reducer output to the Features in the collection. 
  lcover = modisLCover.eq(ee.Image.constant(cclasses)).multiply(ee.Image.pixelArea()).divide(10000).rename(cclasses_names)

  #Calculate zonal stats
  stats = lcover.reduceRegion(ee.Reducer.sum(),poly,maxPixels=1000000000,scale=1000)


	#    '6f6f6f', #// unknown
	#    'aec3d4', #// water
	#    '111149', #// mangrove
	#    '387242', #// tree (mixed evergreen/deciduous)
	#    'c3aa69', #// shrub
	#    'cc0013', #// impervious surface
	#    '8dc33b', #// crop
	#    '30eb5b', #// tree (deciduous) 
	#    '152106', #// tree (evergreen: mixed broadleaf/needleleaf)
	#    'ff4ef8', #// tree (evergreen: needleleaf)


  
  unknown = float(stats.get("0").getInfo())
  water = float(stats.get("1").getInfo())
  mangrove = float(stats.get("2").getInfo())
  tree1 = float(stats.get("3").getInfo())
  shrub = float(stats.get("4").getInfo())
  impervious = float(stats.get("5").getInfo())
  crop = float(stats.get("6").getInfo())
  tree2 = float(stats.get("7").getInfo())
  tree3 = float(stats.get("8").getInfo())
  tree4 = float(stats.get("9").getInfo())
  
  lcClass = ["unknown","water","mangrove","tree (mixed evergreen/deciduous)","shrub","impervious surface","crop","tree (deciduous)","tree (evergreen: mixed broadleaf/needleleaf)","tree (evergreen: needleleaf)"]
  lcArea = [unknown,water,mangrove,tree1,shrub,impervious,crop,tree2,tree3,tree4]

  print "finished", lcClass, lcArea

  return [lcClass, lcArea]


def ComputeChirpsPPT(poly):
  """Returns a series of brightness over time for the polygon."""
  IMAGE_COLLECTION_ID = 'UCSB-CHG/CHIRPS/PENTAD'
  REDUCTION_SCALE_METERS = 1000
  
  collection = ee.ImageCollection(IMAGE_COLLECTION_ID).filterDate('2015-01-01', '2015-12-31')
  

  # Compute the mean brightness in the region in each image.
  def ComputeMean(img):
    reduction = img.reduceRegion(
        ee.Reducer.mean(), poly, REDUCTION_SCALE_METERS)
    return ee.Feature(None, {        
        'precipitation': reduction.get('precipitation'),
        'imagedate': img.get('system:index')
    })
  precipitation_data = collection.map(ComputeMean).getInfo()

  dateList = []
  pptList = []
  
  # Loop through each of the features
  for feature in precipitation_data['features']:
    imgdate = feature['properties']['imagedate']
    ppt = feature['properties']['precipitation']
    dateList.append(imgdate)
    pptList.append(round(ppt,2))
    
  return [dateList, pptList]
  

