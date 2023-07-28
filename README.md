# Materials browser front

All documentation herein is based off [the previous repo](https://github.com/FAIRsFAIR/materials-browser-api). All of it applies.

## Changes made

I had a large amount of difficulty getting the Docker image to work properly and play nice with a reverse proxy. As a result; I compiled to statics and then copied that inside an nginx container (which works predictably.)

This is roughly what the build_package.sh script does as well when you look at it; the only difference is that it's trying to run using ng, which is a hassle in this case with a reverse proxy.

## Compiling to statics

1. Clone repo
2. Run `build_package.sh`
3. `docker build -f Dockerfile-nginx -t <owner/name:tag> .`
4. `docker push`

Now serve from the image.

## Manual changes

Always manually configure the API url, same as it says in the original instruction. You need to set this to the outside of your reverse proxy.


![EU Flag|64x47](eu_logo.png)This project has received funding from the European Union’s Horizon 2020 research and innovation programme under grant agreement No 101017536. The funding was awarded through the RDA (https://www.rd-alliance.org/) Open Call mechanism (https://eoscfuture-grants.eu/provider/research-data-alliance) based on evaluations of external, independent experts.


