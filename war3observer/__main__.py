import argparse
import json

from .server import Server

def main():
  parser = argparse.ArgumentParser()
  parser.add_argument('--config', default='./war3observer.config.json')

  args = parser.parse_args()

  with open(args.config, 'r') as json_file:
    config = json.load(json_file)

  server = Server(config)
  server.serve()

if __name__ == '__main__':
  main()
