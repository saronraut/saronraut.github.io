// First Task: Use d3 to read json and create a horizontal bar chart with top ten OTU

// realzied I need to make it into a function so it can be called during changed event
function getPlots (id){
    d3.json("samples.json").then((data) => {
        console.log(data);
        // trying to plot the otu from first sample
        let sample_ids = data.samples.filter(item => item.id.toString() === id)[0];
        // console.log(sample_ids);  

        // getting the list of the first 10
        let top10_ids = sample_ids.otu_ids.slice(0,10);
        // console.log(top10_ids);

        // create an array(list) of samples_value 
        let top10_values = data.samples.filter(item => item.id.toString() === id)[0].sample_values.slice(0,10);
        // console.log(top10_values);

        // create an array of otu labels that correlate with info
        let top10_labels = data.samples.filter(item => item.id.toString() === id)[0].otu_labels.slice(0,10);
        // console.log(top10_labels);

        // Since the Otu is displayed as int, need to add "OTU" infront
        // to insure its seens as string and easy to read. 
        // map method allows to create a new array with added info
        let top_OTU_id = top10_ids.map(id => "OTU " + id);
        // console.log(top_OTU_id);

        // create a trace for plot
        // used reverse to display the graph from highest to lowest
        let tracebar = {
            x: top10_values.reverse(),
            y: top_OTU_id.reverse(),
            type: "bar",
            orientation : 'h',
            text : top10_labels.reverse()
            };

        let layout = {
            title : "Top 10 OTU",
            showlegend : false
            };
        // create the data into an array
        let bardata = [tracebar];

        // Use plotly to create a barh
        Plotly.newPlot("bar", bardata, layout)


        // Second TASK: Creating a bubble chart that display each samples
        
        // create an array(list) 
        var otu_ids = data.samples.filter(item => item.id.toString() === id)[0].otu_ids;
        var otu_labels = data.samples.filter(item => item.id.toString() === id)[0].otu_labels;
        var sample_values = data.samples.filter(item => item.id.toString() === id)[0].sample_values;

        //  created a Trace for Bubble plot
        let tracebubble = {
            x: otu_ids,
            y: sample_values,
            mode: "markers",
            marker : {
                size: sample_values,
                color: otu_ids
            },
            text : otu_labels
            };
        // assign layout for clear context layout name was changed. 
        let layout_2 = {
            height: 500,
            width : 1000,
            xaxis : {title:"OTU ID"}
            };

        // creating an array for plot
        let bubbledata = [tracebubble];
        
        // Plotting the bubble table
        Plotly.newPlot("bubble", bubbledata, layout_2)

    });
};

// work on creating demographic data
// call function to get data for id
function getdeminfo(id){

    d3.json("samples.json").then ((data)=> {
    // get only the metadata info
        let meta_data = data.metadata;
        console.log(meta_data);
        
        // filter meta_data for info by id
        let result = meta_data.filter(item => item.id.toString() === id)[0];
        
        // select demographic panel from the html
        let demographInfo = d3.select("#sample-metadata");

        // empty the panel to refresh after each search 
        demographInfo.html("");

        // extract the necessary demogrphic data based on id and append info to the panel
        Object.entries(result).forEach((key)=> {
            demographInfo.append("h5").text(key[0] + ": " + key[1] + "\n");
        }); 
    });
 };
// function for change event
function optionChanged (id) {
    getPlots(id);
    getdeminfo (id);   
}


 // need to add inital data for info to display
function init() {
    // select the drop down menu
    let dropdown = d3.select("#selDataset");

    // read the data 
    d3.json("samples.json").then((data)=> {
        console.log(data)

 // get the id data to the dropdwown menu
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

    // call the function to display the data
    getPlots(data.names[0]);
    getdeminfo(data.names[0]);
    });
};

// Bonus Challenge 

// initate the call to pop the data
init();
