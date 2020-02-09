import sys
import os
import io
import struct
import configparser

from PIL import Image
from war3structs.storage import CascStore
from war3structs.plaintext import TxtParser

def dds2jpg(data, resize=False):
  jpg = Image.open(io.BytesIO(data))

  if resize:
    jpg = jpg.resize((resize, resize), Image.BICUBIC)

  jpg = jpg.convert('YCbCr')
  out_jpg = io.BytesIO()
  jpg.save(out_jpg, format='JPEG')

  return out_jpg.getvalue()

def extract_icons(installation_dir, out_dir):
  included = [
    'abilityskin.txt', 'unitskin.txt', 'itemfunc.txt',
    'humanupgradefunc.txt', 'neutralupgradefunc.txt', 'nightelfupgradefunc.txt',
    'orcupgradefunc.txt', 'undeadupgradefunc.txt'
  ]

  wc3 = CascStore(installation_dir)
  icons = {}
  iconsHd = {}

  print('Collecting icons...')

  for txt in included:
    contents = wc3.read('war3.w3mod:units\\%s' % txt).decode('utf-8')

    # Syntax errors
    contents = contents.replace('/ Stuffed Penguin\r\n', '')
    contents = contents.replace('\r\nUnits\\Creeps\\MishaLvl1\\MishaLvl1\r\n', '\r\n')
    contents = contents.replace('\r\nstormreaverhermit\r\n', '\r\n')
    contents = contents.replace('Art=ReplaceableTextures\\CommandButtons\\BTNMalFurionWithoutStag.blp\r\n', '')

    config = TxtParser.parse(contents)
    for section in config:
      # Unused in melee
      if section in ['Aoth', 'Nmsr', 'Hddt']:
        continue

      foundHdArt = False
      artHd = config[section].get('Art:hd', None)
      art = config[section].get('Art', None)

      # Add the hd icon to the list, if any is found.
      if not artHd is None and len(artHd.strip()) > 0:
        artHd = artHd.split(',')[0]
        iconsHd[section] = artHd.replace('.blp', '.dds')
        foundHdArt = True

      # Add the sd icon to the list.
      if not art is None and len(art.strip()) > 0:
        art = art.split(',')[0]
        icons[section] = art.replace('.blp', '.dds')

        # If this id had no hd counterpart, add this to the hd list
        # as well.
        if not foundHdArt:
          iconsHd[section] = icons[section]

      # If an hd icon exists but not an sd icon, it must be a skin.
      # Fall back on the source icon.
      elif foundHdArt:
        skinnableId = config[section].get('skinnableID', None)

        # If there's no source icon or the source icon is the same as
        # this icon, this just gets skipped.
        if not skinnableId is None and len(skinnableId.strip()) > 0 and skinnableId != section:
          sourceArt = config[skinnableId].get('Art', None)
          if not sourceArt is None and len(sourceArt.strip()) > 0:
            sourceArt = sourceArt.split(',')[0]
            icons[section] = sourceArt.replace('.blp', '.dds')

  print('Extracting SD icons...')

  for id_, path in icons.items():
    out_path = os.path.join(out_dir, id_ + '.jpg')

    dds_data = wc3.read('war3.w3mod:%s' % path.lower())

    with open(out_path, 'wb') as fh:
      fh.write(dds2jpg(dds_data))

  print('Extracting HD icons...')

  for id_, path in iconsHd.items():
    out_path = os.path.join(out_dir, 'hd', id_ + '.jpg')

    # Some icons only exist in sd.
    if id_ in ['ANia']:
      dds_data = wc3.read('war3.w3mod:%s' % path.lower())
    else:
      dds_data = wc3.read('war3.w3mod:_hd.w3mod:%s' % path.lower())

    with open(out_path, 'wb') as fh:
      fh.write(dds2jpg(dds_data, resize=128))

def main():
  try:
    extract_icons(sys.argv[1], sys.argv[2])
  except Exception as err:
    raise

if __name__ == '__main__':
  main()
