# RS_P2: Rico's Lab
A non-utiliy project that stemmed from a class, Radical Software

## Concept
The aim of Rico's Lab is to allow people to explore goofy recipes that are generated by chatGPT by giving it an item that they have in their fridge. People can also explore other goofy recipes that are generated by other people, leaving ratings, reviews and photos of their attempt at the recipe.

## Execution
I used the ChatGPT API to generate silly recipes that people can try base on an item that they input. That item could be something in their fridge or something they would like to generate a silly recipe with. Once the recipe has been generated, it will be added to a MongoDB Atlas database, where people can later explore other generated recipes or search for a specific thing they are looking for.

## Figma
Early page design
https://www.figma.com/file/4czV8e09uHzVsF58SVmcoj/Radical-Software%3A-P2?type=design&t=LPddzngL4P4WtRoS-1

## Video Demonstration
https://drive.google.com/file/d/1cJ9Ztfk7PG2Gco-gTc-wLQa6vpSSLAPu/view?usp=sharing

## To Run
- make sure you have the latest version of node on your desktop
- fork or download the file
- run npm install
- to run it locally:
    ```
       npm start for node
       npm dev for nodemon
     ```
