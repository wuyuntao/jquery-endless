# -*- coding: UTF-8 -*-

import os
import random
from datetime import datetime
from bottle import debug, mako_view as view, request, route, run, send_file

ROOT_PATH = os.path.dirname(__file__)

USERS = ['levelwing', 'ilikeyoutwo', 'tsukimaro2', 'ucaanc', 'mockee', 'jasonchengxu', 'antikinalanli', 'opera', 'leepanpan', 'xianggong', 'mio_isurugi']

SAMPLE_TEXT = """
  The Zen of Python

  Beautiful is better than ugly.
  Explicit is better than implicit.
  Simple is better than complex.
  Complex is better than complicated.
  Flat is better than nested.
  Sparse is better than dense.
  Readability counts.
  Special cases aren't special enough to break the rules.
  Although practicality beats purity.
  Errors should never pass silently.
  Unless explicitly silenced.
  In the face of ambiguity, refuse the temptation to guess.
  There should be one, and preferably only one, obvious way to do it.
  Although that way may not be obvious at first unless you're Dutch.
  Now is better than never.
  Although never is often better than *right* now.
  If the implementation is hard to explain, it's a bad idea.
  If the implementation is easy to explain, it may be a good idea.
  Namespaces are one honking great idea, let's do more of those!
  """

@route('/')
@view('index')
def index():
  return {'statuses': random_status(10000, prev=False)}

@route('/prev')
def prev():
  id = request.GET['id']
  return {
    'id': id,
    'statuses': random_status(id),
  }

@route('/next')
def next():
  id = request.GET['id']
  return {
    'id': id,
    'statuses': random_status(id, prev=False),
  }

@route('/media/:path')
def media_file(path):
  print path, ROOT_PATH
  return send_file(path, root='media')

def random_user(users, k=3):
  return random.sample(users, k)

def random_text(text, k=3):
  text = text.split()
  random.shuffle(text)
  text = ' '.join(text)
  return [text[i * 100:(i + 1) * 140] for i in range(k)]

def random_status(id, prev=True, k=10):
  id = int(id)
  count = random.randint(0, k)
  ids = range(id - count - 1, id - 1) if prev else range(id + 1, id + count + 1)
  ids.reverse()
  users = random_user(USERS, k=count)
  texts = random_text(SAMPLE_TEXT, k=count)
  return [{'id': id, 'user': user, 'text': text, 'created_at': str(datetime.now())} \
          for id, user, text in zip(ids, users, texts)]

if __name__ == '__main__':
  debug(True)
  run(host='localhost', port=8080, reloader=True)
