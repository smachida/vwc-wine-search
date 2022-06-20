#!/bin/bash
npm install
ng build --prod
docker build --tag=vwc-wine-search .
