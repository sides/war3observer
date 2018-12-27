import sys
import os
import io
import struct
import configparser

from PIL import Image
from war3structs.storage import CascStore
from war3structs.plaintext import TxtParser

def flipbgrrgb(data):
  # TODO: This is going a long way for this relatively simple task and
  #       some detail gets lost. Need to be not a compression noob and
  #       do this right.
  jpg = Image.open(io.BytesIO(data))
  jpg = jpg.convert('RGBA')
  b, g, r, a = jpg.split()
  jpg = Image.merge('RGBA', (r, g, b, a)).convert('YCbCr')
  out_jpg = io.BytesIO()
  jpg.save(out_jpg, format='JPEG')

  return out_jpg.getvalue()

def jpgblp2jpg(data):
  # Unfancy method to get the jpg part from jpg-blp.
  stream = io.BytesIO(data)
  stream.seek(28)
  first_mipmap_offset = struct.unpack('<i', stream.read(4))[0]

  stream.seek(60, io.SEEK_CUR)
  first_mipmap_size = struct.unpack('<i', stream.read(4))[0]

  stream.seek(60, io.SEEK_CUR)
  jpg_h_size = struct.unpack('<i', stream.read(4))[0]
  jpg_h = stream.read(jpg_h_size)

  stream.seek(first_mipmap_offset)
  jpg_data = stream.read(first_mipmap_size)

  return jpg_h + jpg_data

def extract_icons(installation_dir, out_dir):
  included = [
    'commonabilityfunc.txt',
    'humanabilityfunc.txt', 'humanunitfunc.txt', 'humanupgradefunc.txt',
    'itemabilityfunc.txt', 'itemfunc.txt',
    'neutralabilityfunc.txt', 'neutralunitfunc.txt', 'neutralupgradefunc.txt',
    'nightelfabilityfunc.txt', 'nightelfunitfunc.txt', 'nightelfupgradefunc.txt',
    'orcabilityfunc.txt', 'orcunitfunc.txt', 'orcupgradefunc.txt',
    'undeadabilityfunc.txt', 'undeadunitfunc.txt', 'undeadupgradefunc.txt']

  wc3 = CascStore(installation_dir)
  icons = {}

  print('Collecting icons...')

  for txt in included:
    contents = wc3.read('war3.mpq:units\\%s' % txt).decode('utf-8')

    # Syntax errors
    contents = contents.replace('/ Stuffed Penguin\r\n', '')

    config = TxtParser.parse(contents)
    for section in config:
      art = config[section].get('Art', None)
      if not art is None and len(art.strip()) > 0:
        art = art.split(',')[0]
        icons[section] = art
        continue

  print('Extracting icons...')

  for id_, path in icons.items():
    out_path = os.path.join(out_dir, id_ + '.jpg')

    blp_data = wc3.read('war3.mpq:%s' % path.lower())

    with open(out_path, 'wb') as fh:
      fh.write(flipbgrrgb(jpgblp2jpg(blp_data)))

def main():
  try:
    extract_icons(sys.argv[1], sys.argv[2])
  except Exception as err:
    raise

if __name__ == '__main__':
  main()
