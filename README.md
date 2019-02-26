# Form Library

### Setup -- testing with serve 
1. Clone repository via SSH/Download Zip 
2. Run ```npm install``` to install all packages
3. Either run ```npm run buildDev``` to run and watch all react files or ```npm run build``` for a one time  build
4. Run ```npm run serve``` to start the express server
5. Load up ```localhost:3000``` on any browser and click on the dist folder

Serve will eventually be removed.


default behaviour note for timeinput
if you specify a block array [2,3,1,5] and a custom maxlength (otherwise calculated by sum) exceeds the total of 
-those blocks, it will take the last number (5) for all future block sizes