

# # Put string here:
# coordsString = """new google.maps.LatLng(40.346222,-74.658846),
# new google.maps.LatLng(40.346044,-74.658765),
# new google.maps.LatLng(40.346035,-74.658796),
# new google.maps.LatLng(40.345701,-74.658643),
# new google.maps.LatLng(40.345702,-74.658634),
# new google.maps.LatLng(40.345699,-74.658626),
# new google.maps.LatLng(40.345693,-74.658621),
# new google.maps.LatLng(40.345709,-74.658538),
# new google.maps.LatLng(40.345723,-74.658532),
# new google.maps.LatLng(40.345728,-74.658517),
# new google.maps.LatLng(40.345725,-74.658503),
# new google.maps.LatLng(40.345714,-74.658498),
# new google.maps.LatLng(40.345702,-74.658500),
# new google.maps.LatLng(40.345647,-74.658478),
# new google.maps.LatLng(40.345644,-74.658467),
# new google.maps.LatLng(40.345632,-74.658462),
# new google.maps.LatLng(40.345622,-74.658467),
# new google.maps.LatLng(40.345503,-74.658410),
# new google.maps.LatLng(40.345593,-74.658062),
# new google.maps.LatLng(40.345479,-74.658008),
# new google.maps.LatLng(40.345254,-74.658838),
# new google.maps.LatLng(40.344948,-74.658697),
# new google.maps.LatLng(40.344936,-74.658745),
# new google.maps.LatLng(40.344984,-74.658768),
# new google.maps.LatLng(40.344961,-74.658860),
# new google.maps.LatLng(40.345349,-74.659035),
# new google.maps.LatLng(40.345342,-74.659063),
# new google.maps.LatLng(40.345470,-74.659120)"""
#
# lines = coordsString.split('\n')

with open('DillonCoords.txt') as f:
    lines = f.readlines()

truncatedLines = []
for line in lines:

    if line.endswith('),\n'):
        truncatedLines.append(line[23:-3])
    else:
        truncatedLines.append(line[23:-1])

# print truncatedLines

outPutString = ""
for line in truncatedLines:
    [lat, lng] = line.split(',')
    outPutString += "{lat: " + lat + ", lng: " + lng + "},\n"

outPutString = outPutString[:-2]
print outPutString
