// This code is inspired by Doms tutorial on HW14.
console.log("hello")
// Define a global variable to hold the URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"; 


//think about how to get id numbers or names. 940, 941, etc. there are two ways.
//1.

//2.


// let selector = d3.select("#selDataset"); talking to html of an id of selDataset. Initialize the dropdown. Get a handle to the selector/ dropdown.
// You have assigned a function called InitDashboard that holds a lot of functions. first fetches the JSON data url;  then read all the data and store into the text data.
// d3.json(url).then((can be any text))
// data.names  <-- names is a key/variable in a json url.
// we want to add an option elements in the selector. going to append an option element.
//sampleNames is an array that holds the names/ids. its just one list.
//                  vs
// sampleId is a for looped numbers/ids. multiple individual objects.
// a number shown on the dropdown (front end screen) and values behind the scenes. now you've created a property/key called .property("value") that holds the sampleId numbers.

function InitDashboard() { 
    let selector = d3.select("#selDataset"); 
    d3.json(url).then((data) => {
        console.log("Here's the data:", data); 
        let sampleNames = data.names; 
        console.log("Here are the sample names:", sampleNames); // 940, 941, 943, ...
        // Populate the dropdown box
        for (let i = 0; i < sampleNames.length; i++) {
            let sampleId = sampleNames[i]; 
            console.log("Here are the sample IDs:", sampleId );
            // selector.append("option").text(sampleId);
            selector.append("option").text(sampleId).property("value", sampleId); 
        };      

        // Read the current value from the dropdown
        let initialId = selector.property("value");
        console.log(`initialId = ${initialId}`); 

        // Draw the bargraph for the selected sample id. pass in my initialId.
        // calling a function???
        // if you do DrawBargraph(sampleId); then front page after refresh does not show graphs. so i notice it doesnt communicate with the 940 number shown on the drop down..but  when i click 940, then it spits out the graphs. think about this.
        DrawBargraph(initialId); 

        // Draw the bubblechart for the selected sample id
        DrawBubblechart(initialId); 

        // Show the metadata for the selected sample id 
        ShowMetadata(initialId); 

        // Show the gauge
        DrawGauge(initialId); 

    }); 
}

// think about changing all the sampleId into initialId. what happens really?
// ----filter----
// function called Samples that does: each time I land on an element, calling that s, and each time it does i want to return the id of that sample equals my sampleId.
// samples.filter looks at element by element by element down the array called samples. value gets appended into resultArray.

let xaxis = [0, 2, 6, 7, 9, 10];
let slice = xaxis.slice(0, 4);
console.log("xaxis is:", slice)


function DrawBargraph(sampleId)  //i choose 960
{
    console.log(`DrawBargraph(${sampleId})`); 

    d3.json(url).then((data) => {

        let samples = data.samples; 
        function Samples(object) {return object.id == sampleId}; //pulls out the id of 940
        let resultArray = samples.filter(Samples); //and outs it into this array, resultArray
        let result = resultArray[0]; //gives me the first value in this array. 

        let otu_ids = result.otu_ids; 
        // console.log("otu_ids:", otu_ids);
        let otu_labels = result.otu_labels; 
        let sample_values = result.sample_values; 

        let yticks = otu_ids.slice(0, 10).map(otuId => `OTU ${otuId}`).reverse();
        // for each thing we find in the otu_ids array, only the first 10 values of it, for each otuId i find im going to create OTU ${otuId} string and gonna put the string in y ticks

        // Create a trace object
        let barData = {
            x: sample_values.slice(0, 10).reverse(),
            y: yticks,
            type: 'bar', 
            text: otu_labels.slice(0, 10).reverse(),
            orientation: 'h'
        }; 

        // to put multiple traces for my layout object. the trace object into an array
        let barArray = [barData]; 

        // Create a layout object
        let barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: {t: 30, l: 150}
        }

        // Call the Plotly function 
        Plotly.newPlot("bar", barArray, barLayout); 

    }); 
}

function DrawBubblechart(sampleId)
{
    console.log(`DrawBubblechart(${sampleId})`); 

    d3.json(url).then(data => {

        let samples = data.samples; 
        let resultArray = samples.filter(object => object.id == sampleId); 
        // sample that has an id that's equal to the parameter sampleId in DrawBubblechart(sampleId). filtering on that sampleId. 
        let result = resultArray[0]; 

        let otu_ids = result.otu_ids; 
        let otu_labels = result.otu_labels; 
        let sample_values = result.sample_values; 

        // Create a trace
        let bubbleData = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels, 
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        // Put the trace into an array
        let bubbleArray = [bubbleData]; 

        // Create a layout object
        let bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            margin: {t: 30, l: 150},
            hovermode: "closest", 
            xaxis: { title: "OTU ID"}
        };

        // Call Plotly
        Plotly.newPlot("bubble", bubbleArray, bubbleLayout); 

    }); 










}

function DrawGauge(sampleId)
{
    console.log(`DrawGauge(${sampleId})`); 
}

// function ShowMetadata()
// {
//     {d3.json(url).then((data) => {  
//         let metadata= data.metadata;
//         console.log("metadata:", metadata);
//         for (let i = 0; i < metadata.length; i++) {
//         let metaarray = metadata[i];
//         console.log("metaarry is:", metaarray);
//         // let metararray= metadata[0]; // id = 940
//         // communicating with id on index.html. Capture the HTML of a selection
//         let panel = d3.select("#sample-metadata").html("");
//         Object.entries(metaarray).forEach(([key, value]) => {panel.append("h6").text(`${key}: ${value}`); });
//             }
//         });
    
//     }
// }

function ShowMetadata(sampleId) {d3.json(url).then((data) => {
    let metadata= data.metadata; // gives you all the keys in the metadata from ID=940-1601.
    // Samples is a filter function that has an object sampleobject which will only spit out the id numbers that you pick on the interface.
    console.log(metadata[0]);
    console.log(metadata.id); // = undefined.
    console.log("this is the metadata:", metadata);
    console.log("what is the sample?:", sampleId); //
    function Samples(object) {return object.id == sampleId};
    let Metaarray= metadata.filter(Samples);
    let Metaresult= Metaarray[0] // id = 940
    // communicating with id on index.html. Capture the HTML of a selection
    let panel = d3.select("#sample-metadata").html("");
    Object.entries(Metaresult).forEach(([key, value]) => {panel.append("h6").text(`${key}: ${value}`); });
    });
}

// function ShowMetadata()
// {
//     {d3.json(url).then((data) => {  
//         let metadata= data.metadata;
//         console.log("metadata:", metadata);
//         let metaarray = metadata.map(function(meta) {return `${meta.name}: ${meta.age}`;});
//         // let metaresult= metadata[0]; // id = 940
//         // communicating with id on index.html. Capture the HTML of a selection
//         let panel = d3.select("#sample-metadata").html("");
//         Object.entries(metaarray).forEach(([key, value]) => {panel.append("h6").text(`${key}: ${value}`); });
//         });
    
//     }
// }


// function ShowMetadata() {
//     d3.json(url).then((data) => {
//     let sampleNames = data.names; 
//         console.log("Here are the sample names:", sampleNames); // 940, 941, 943, ...
//         for (let i = 0; i < sampleNames.length; i++) {
//             let sampleId = sampleNames[i]; 
//             console.log("Here are the sample IDs:", sampleId );
//             function Samples(s) {return s.id == sampleId}; //pulls out the id of 960 
//             let resultArray = samples.filter(Samples); //and outs it into this array, resultArray
//             console.log(metaresult);
//             // communicating with id on index.html. Capture the HTML of a selection
//             let panel = d3.select("#sample-metadata").html("");
//             Object.entries(Metaresult).forEach(([key, value]) => {panel.append("h6").text(`${key}: ${value}`); });

//     }});

// }


// see index.html optionChanged. passing in something called this.value shown in the dropdown box control.its a value in the drop down control. also get comfortable with selector.on. no need since onchange is in index.html.

// an event handler that runs anytime when the  numbers in the dropdown menu control changes. if I change the value in the drop down box, what else has to happen? it needs to talk to the other function bar graph and other graphs functions. what happens if we dont have the function below, play with it. 
// implementing the event handler for changes to the dropdown.


function optionChanged(sampleId)
{
    console.log(`optionChanged, new value: ${sampleId}`); 

    DrawBargraph(sampleId); 
    DrawBubblechart(sampleId); 
    ShowMetadata(sampleId); 
    DrawGauge(sampleId); 
}



// calling the function for the function to run.
InitDashboard(); 




// --------------------------------



// // Fetch the JSON data.
// // You have assigned a function called Metadata that fetches the JSON data called "samples.json"  then read all the data. the function Metadata returns {what ever is in this bracket} sample is a big object.

// // function Metadata(sample) {console.log(sample)}; this gives you the sample ID depending on what you choose on the drop box on the website interface.

// function Metadata(sample) {d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
//     let metadata= data.metadata; // gives you all the keys in the metadata from ID=940-1601.
//     // Samples is a filter function that has an object sampleobject which will only spit out the id numbers that you pick on the interface.
//     console.log(metadata[0]);
//     console.log(metadata.id); // = undefined.
//     console.log("this is the metadata:", metadata);
//     console.log("what is the sample?:", sample); // why is sample = 940?
//     function Samples(sampleobject) {return sampleobject.id == sample};
//     let Metaarray= metadata.filter(Samples);
//     let Metaresult= Metaarray[0] // id = 940
//     // communicating with id on index.html. Capture the HTML of a selection
//     let panel = d3.select("#sample-metadata").html("");

  
//   //   review the activity. didnt we select the header for table example? first then append it? also review .text. what it does.

//    // Iterate through each key and value in the metadata
//    //   select this div and read this text. the text shown on index.html. if it is .text() it will select the text shown on the index.html in between the divs.
//   //  you are appending key: value into .html(""). but why are we capturing the html? Class 3-Activity 3.
//   //does the h3, h4, h5, h6 just alter the size?
//     Object.entries(Metaresult).forEach(([key, value]) => {panel.append("h6").text(`${key}: ${value}`); });

//   //buildGauge(result.wfreq)



//   });
// }


// //function buildGauge(wfreq) {}

// function buildCharts(sample) {

// // Use `d3.json` to fetch the sample data for the plots
// d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
//   var samples= data.samples;
//   var Metaarray= samples.filter(sampleobject => 
//       sampleobject.id == sample);
//   var Metaresult= Metaarray[0]

//   var ids = Metaresult.otu_ids;
//   var labels = Metaresult.otu_labels;
//   var values = Metaresult.sample_values;

// //------------------------------------------------------//
// //------------------------------------------------------//
//           // Build a BUBBLE Chart 
// //------------------------------------------------------//
// //------------------------------------------------------//

//   var LayoutBubble = {
//     margin: { t: 0 },
//     xaxis: { title: "OTU ID" },
//     hovermode: "closest",
//     };

//     var DataBubble = [ 
//     {
//       x: ids,
//       y: values,
//       text: labels,
//       mode: "markers",
//       marker: {
//         color: ids,
//         size: values,
//         }
//     }
//   ];

//   Plotly.newPlot("bubble", DataBubble, LayoutBubble);


// //---------------------------------------------------------//
// //---------------------------------------------------------//
//               //  Build a BAR Chart
// //---------------------------------------------------------//  
// //---------------------------------------------------------// 
//   var bar_data =[
//     {
//       y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
//       x:values.slice(0,10).reverse(),
//       text:labels.slice(0,10).reverse(),
//       type:"bar",
//       orientation:"h"

//     }
//   ];

//   var barLayout = {
//     title: "Top 10 Bacteria Cultures Found",
//     margin: { t: 30, l: 150 }
//   };

//   Plotly.newPlot("bar", bar_data, barLayout);
// });
// }
 

// function init() {
// // Grab a reference to the dropdown select element
// var selector = d3.select("#selDataset");

// // Use the list of sample names to populate the select options
// d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
//   var sampleNames = data.names;
//   sampleNames.forEach((sample) => {
//     selector
//       .append("option")
//       .text(sample)
//       .property("value", sample);
//   });

//   // Use the first sample from the list to build the initial plots
//   const firstSample = sampleNames[0];
//   buildCharts(firstSample);
//   Metadata(firstSample);
// });
// }

// function optionChanged(newSample) {
// // Fetch new data each time a new sample is selected
// buildCharts(newSample);
// Metadata(newSample);
// }



// // Initialize the dashboard
// init();