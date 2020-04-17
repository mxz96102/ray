import os
import ray
import pprint
import time

os.environ.pop('http_proxy', None)
os.environ.pop('https_proxy', None)

r = ray.init(num_cpus=2, num_gpus=2)
pprint.pprint(r)


@ray.remote(num_cpus=1)
class B(object):
    pass


@ray.remote
class A(object):
    def foo(self):
        B.remote()
        time.sleep(100000)


@ray.remote
def bar():
    time.sleep(100000)


a = A.remote()
a.foo.remote()

b = bar.remote()

while True:
    time.sleep(100000)
