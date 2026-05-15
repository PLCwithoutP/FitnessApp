#!/bin/bash

clear
rm -rf FitnessApp

git clone https://github.com/PLCwithoutP/FitnessApp.git

cd FitnessApp
npm install
npm run dev
