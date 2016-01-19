/**
 * Created by JoséJuan on 13/01/2016.
 */

var	margin = {top: 30, right: 30, bottom: 30, left: 0},
    width = 500 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;



var	x = d3.scale.linear().range([0, width]);
var	y = d3.scale.linear().range([height, 0]);

var	xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(19);

var	yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

// Define the div for the tooltip
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var	valueline = d3.svg.line()
    .x(function(d) { return x(d.Age); })
    .y(function(d) { return y(d.FEV); });


var	svg = d3.select("#visualization")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("transform", "translate(" + 0 + "," + margin.top + ")")
    .append("g")
    .attr("transform", "translate(" + 18 + "," + margin.top + ")");

// Get the data
d3.csv("mean_nonsmoker.csv", function(error, data) {
    d3.csv("mean_smoker.csv", function(error2, data2) {
        data.forEach(function(d) {
            d.i = +d.i;
            d.Age = +d.Age;
            d.FEV = +d.FEV;
        });
        data2.forEach(function (d2) {
            d2.i = +d2.i;
            d2.Age = +d2.Age;
            d2.FEV = +d2.FEV;
        });
        // Scale the range of the data
        x.domain([2, d3.max(data,function(d) {return Math.max(d.Age)})]);
        y.domain([0.5, 6.5]);

        svg.append("path")		// Add the valueline path.
            .attr("class", "line1")
            .attr("d", valueline(data));

        svg.append("path")		// Add the valueline2 path.
            .attr("class", "line2")
            .style("stroke", "red")
            .attr("d", valueline(data2));

        // Add the scatterplot
        svg.selectAll("dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dots1")
            .attr("r", 5)
            .attr("cx", function(d) { return x(d.Age); })
            .attr("cy", function(d) { return y(d.FEV); })
            .style("fill", "steelblue")
            .on('click', function(d) {
                boxplot(d.Age, "smokey.csv","smoken.csv", " years old");
                d3.selectAll(".person").remove();
                gender(d.i, "","mean_nonsmoker.csv", "mean_smoker.csv");
            })

            .on("mouseover", function(d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div	.html("Age: " + (d.Age) + "<br/>" + "FEV: " + Math.round(d.FEV*100)/100)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px"), d3.selectAll(".dots1").style("cursor", "pointer");
            })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        svg.selectAll("dot")
            .data(data2)

            .enter().append("circle")
            .attr("class", "dots2")
            .attr("r", 5)
            .attr("cx", function(d) { return x(d.Age); })
            .attr("cy", function(d) { return y(d.FEV); })
            .style("fill", "red")
            .on('click', function(d) {
                boxplot(d.Age, "smokey.csv","smoken.csv", " years old");
                d3.selectAll(".person").remove();
                gender(d.i, "smoke", "mean_nonsmoker.csv", "mean_smoker.csv");
            })
            .on("mouseover", function(d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div	.html("Age: " + (d.Age) + "<br/>" + "FEV: " + Math.round(d.FEV*100)/100)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px"), d3.selectAll(".dots2").style("cursor", "pointer");
            })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        svg.append("g")			// Add the X Axis
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label1")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text("Ages");

        svg.append("g")			// Add the Y Axis
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("FEV (L)");

        svg.append("text")
            // .attr("transform", "translate(" + (width+3) + "," + y(data[0].Age) + ")")
            .attr("transform", "translate(" + (230) +"," + 35 + ")")
            .attr("dy", ".35em")
            .attr("text-anchor", "start")
            .style("fill", "red")
            .text("Smoking");

        svg.append("text")
            .attr("id", "title")
            .attr("transform", "translate(" + (130) +"," + (-20) + ")")
            .attr("dy", ".35em")
            .attr("text-anchor", "start")
            .style("fill", "black")
            .style("font-size", "17px")
            .text("Average FEV at each Age");

        svg.append("text")
            .attr("transform", "translate(" + (100) + "," + 35 + ")")
            .attr("dy", ".35em")
            .attr("text-anchor", "start")
            .style("fill", "steelblue")
            .text("Non Smoking");

        var menu = d3.select("#categories")
            .on("change", function() {
                console.log(menu.property("value"));
                // if menu.property("value") === "d.Ht" return "visible";
                if (menu.property("value") == "d.Ht") {
                    d3.csv("Nsmoke_scatt.csv", function(error, data) {
                        d3.csv("Smoke_scatt.csv", function(error2, data2) {
                            data.forEach(function(d) {

                                d.FEV = +d.FEV;
                                d.Ht = +d.Ht
                                d.i = +d.i;
                            });
                            data2.forEach(function (d2) {

                                d2.FEV = +d2.FEV;
                                d2.Ht = +d2.Ht
                                d2.i = +d2.i;
                            });
                            updateData(data,data2, menu.property("value"));
                            boxplot(67, "Smokebyheight.csv", "NonSmokebyheight.csv", " inches");
                            d3.selectAll(".person").remove();
                            gender(14, "", "Nsmoke_scatt.csv", "Smoke_scatt.csv");
                        });
                    });
                } else {
                    d3.csv("mean_nonsmoker.csv", function(error, data) {
                        d3.csv("mean_smoker.csv", function(error2, data2) {
                            data.forEach(function(d) {

                                d.Age = +d.Age;
                                d.FEV = +d.FEV;
                                d.Ht = +d.Ht
                            });
                            data2.forEach(function (d2) {

                                d2.Age = +d2.Age
                                d2.FEV = +d2.FEV
                                d2.Ht = +d2.Ht
                            });
                            updateData(data,data2, menu.property("value"));
                            boxplot(15, "smokey.csv","smoken.csv", " years old");
                            d3.selectAll(".person").remove();
                            gender(13, "", "mean_nonsmoker.csv", "mean_smoker.csv");
                        });
                    });


                }
            })

        function updateData(data,data2,arg3) {

            // Scale the range of the data again
            // x.domain(d3.extent(data, function(d) { return d.Ht; }));
            if (arg3 == "d.Ht") {
                var ii = function(d) { return x(d.Ht); };
                x.domain([46,d3.max(data, function(d) { return d.Ht; })]);
                var label = "Height (in)" ;
                svg.select("#title")
                    .text("Average FEV at each Height");
                svg.selectAll("circle.dots1")
                    .on('click', function(d) {
                        console.log(d.i);
                        boxplot(d.Ht, "Smokebyheight.csv", "NonSmokebyheight.csv", " inches");
                        d3.selectAll(".person").remove();
                        gender(d.i, "", "Nsmoke_scatt.csv", "Smoke_scatt.csv");
                    })
                    .on("mouseover", function(d) {
                        div.transition()
                            .duration(200)
                            .style("opacity", .9);
                        div	.html("Ht: " + (d.Ht) + "<br/>" + "FEV: " + Math.round(d.FEV*100)/100)
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY - 28) + "px"), d3.selectAll(".dots1").style("cursor", "pointer");
                    })
                    .on("mouseout", function(d) {
                        div.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });
                svg.selectAll("circle.dots2")
                    .on('click', function(d) {
                        boxplot(d.Ht, "Smokebyheight.csv", "NonSmokebyheight.csv", " inches");
                        d3.selectAll(".person").remove();
                        gender(d.i, "smoke", "Nsmoke_scatt.csv", "Smoke_scatt.csv");
                    })
                    .on("mouseover", function(d) {
                        div.transition()
                            .duration(200)
                            .style("opacity", .9);
                        div	.html("Ht: " + (d.Ht) + "<br/>" + "FEV: " + Math.round(d.FEV*100)/100)
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY - 28) + "px"), d3.selectAll(".dots2").style("cursor", "pointer");
                    })
                    .on("mouseout", function(d) {
                        div.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });

            } else {
                var ii = function(d) { return x(d.Age); };
                x.domain([2, d3.max(data,function(d) {return Math.max(d.Age)})]);
                var label = "Age";
                svg.select("#title")
                    .text("Average FEV at each Age");
                svg.selectAll("circle.dots1")
                    .on('click', function(d) {
                        boxplot(d.Age, "smokey.csv","smoken.csv", " years old");
                        d3.selectAll(".person").remove();
                        gender(d.i, "", "mean_nonsmoker.csv", "mean_smoker.csv");
                    })
                    .on("mouseover", function(d) {
                        div.transition()
                            .duration(200)
                            .style("opacity", .9);
                        div	.html("Age: " + (d.Age) + "<br/>" + "FEV: " + Math.round(d.FEV*100)/100)
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY - 28) + "px"), d3.selectAll(".dots1").style("cursor", "pointer");
                    })
                    .on("mouseout", function(d) {
                        div.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });
                svg.selectAll("circle.dots2")
                    .on('click', function(d) {
                        boxplot(d.Age, "smokey.csv","smoken.csv", " years old");
                        d3.selectAll(".person").remove();
                        gender(d.i, "smoke", "mean_nonsmoker.csv", "mean_smoker.csv");
                    })
                    .on("mouseover", function(d) {
                        div.transition()
                            .duration(200)
                            .style("opacity", .9);
                        div	.html("Age: " + (d.Age) + "<br/>" + "FEV: " + Math.round(d.FEV*100)/100)
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY - 28) + "px"), d3.selectAll(".dots2").style("cursor", "pointer");
                    })
                    .on("mouseout", function(d) {
                        div.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });
            }

            // y.domain([0.5, d3.max(data, function(d) { return d.FEV; })]);
            y.domain([0.5, 6.5]);
            // Select the section we want to apply our changes to
            console.log(ii);
            var	valueline = d3.svg.line()
                .x(ii)
                .y(function(d) { return y(d.FEV); });
            // Make the changes
            svg.select(".line1")   // change the line
                .transition()
                .duration(750)
                .attr("d", valueline(data));

            svg.select(".line2")   // change the line
                .transition()
                .duration(750)
                .attr("d", valueline(data2));

            // Add the scatterplot
            svg.selectAll("circle.dots1")
                .data(data)
                .transition()
                .duration(750)
                .attr("cx", ii)
                .attr("cy", function(d) { return y(d.FEV); });


            svg.selectAll("circle.dots2")
                .data(data2)
                .transition()
                .duration(750)
                .attr("cx", ii)
                .attr("cy", function(d) { return y(d.FEV); });


            svg.select(".x.axis") // change the x axis
                .transition()
                .duration(750)
                .call(xAxis)

            svg.select(".label1")
                .transition()
                .duration(750)
                .attr("x", width)
                .attr("y", -6)
                .style("text-anchor", "end")
                .text(label);

            svg.select(".y.axis") // change the y axis
                .transition()
                .duration(750)
                .call(yAxis);


        }
    })
});

function boxplot(exp, filename1, filename2, mes) {
d3.csv(filename1, function(error, data) {
    d3.csv(filename2, function(error2, data2) {

        data.forEach(function(d){

            d.Var = +d.Var;
            d.FEV = +d.FEV;
        });
        data2.forEach(function (d2){

            d2.Var = +d2.Var;
            d2.FEV = +d2.FEV;
        });


        var obj = [];

        for(var i = 0; i < data.length; i++) {

            if (data[i].Var == exp){

                obj.push(data[i].FEV)

            }}

        var obj2 = [];

        for(var i = 0; i < data2.length; i++) {

            if (data2[i].Var == exp){

                obj2.push(data2[i].FEV)

            }}



        var trace1 = {
            y: obj,
            type: 'box',
            name: 'Smoking',
            marker:{
                color: 'red'
            }
        };

        var trace2 = {
            y: obj2,
            type: 'box',
            name: 'Non Smoking',
            marker:{
                color: 'lightblue'
            }
        };

        var ALL = [trace1, trace2];

        var layout = {

            autosize: false,
            width: 500,
            height: 340,
            margin: {
                l: 50,
                r: 50,
                b: 30,
                t: 100,
                pad: 4
            },
            font: {
                family: "Helvetica"
            },
            title: "FEV variance at " + exp + mes,
            yaxis: {
                title: 'FEV (L)'
            }

        };

        Plotly.newPlot('myDiv', ALL, layout, {displayModeBar: false});


    });});
}
boxplot(15, "smokey.csv","smoken.csv", " years old");
var lin_co = [6.894578728,
    -0.274234148,
    0.003125062,
    0.094535151,
    -0.133211169,
    0.069464619 ];

smoking = function(height, age, gender,smoke){

    Gender = 0

    if (gender == "Male"){Gender = 1}
    else if (gender == "Female"){Gender = 0}

    return(lin_co[0] +
    lin_co[1]*height +
    lin_co[2]*(height*height) +
    lin_co[3]*Gender +
    lin_co[4]*smoke +
    lin_co[5]*age)


};

non_smoking = function(height, age, gender, smoke){

    if (gender == "Male"){Gender = 1}
    else if (gender == "Female"){Gender = 0}

    return(lin_co[0] +
    lin_co[1]*height +
    lin_co[2]*(height*height) +
    lin_co[3]*Gender +
    lin_co[4]*smoke +
    lin_co[5]*age)


};

document.getElementById("button1").addEventListener('click',
    function () {
        var age = document.getElementById("age").value;
        var height2 = document.getElementById("height").value;
        var e = document.getElementById("help");
        var gender = e.options[e.selectedIndex].value;
        console.log(gender);
        console.log(height2);
        console.log(age);
        if(age == "" || height2 == "" || gender == "") {
            console.log("Missing parameters");
        } else {
            var SM = (smoking(height2, age, gender, 1));
            var N_SM = (non_smoking(height2, age, gender, 0));

            var perc_change = Math.round((((1-(SM/N_SM))*100))*10)/10;

            var margin = {top:20 , right: 20, bottom: 30, left: 40},
                width = 960 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;
            var dead_lung = perc_change/3.75;
            var fev = 4.15+dead_lung;
            var mv = dead_lung*19;
            var lungs = d3.selectAll("svg").transition();
            lungs.selectAll(".clip-path")
                .duration(1200)
                .attr("transform", "translate("+ -1 + "," + fev + ")scale(19)");
            lungs.selectAll(".line-label")
                .duration(1200)
                .attr("transform", "translate("+ (350 + mv) + "," + (96.5 + mv) + ")");
            lungs.selectAll(".circle-label")
                .duration(1200)
                .attr("transform", "translate("+ (margin.left + mv) + "," + (margin.top + mv) + ")");
            lungs.selectAll(".text1-label")
                .duration(1200)
                .text(perc_change.toString() + "%")
                .attr("transform", "translate("+  (503 + mv) + "," + (89 + mv) + ")");
            lungs.selectAll(".text2-label")
                .duration(1200)
                .attr("transform", "translate("+  (505 + mv) + "," + (104 + mv) + ")");
            lungs.selectAll(".fev1-label")
                .duration(1200)
                .text(Math.round(N_SM*100)/100)
                .attr("transform", "translate("+  (570 + mv) + "," + (89 + mv) + ")");
            lungs.selectAll(".fev2-label")
                .duration(1200)
                .text(Math.round(SM*100)/100)
                .attr("transform", "translate("+  (635 + mv) + "," + (89 + mv) + ")");
            lungs.selectAll(".fev3-label")
                .duration(1200)
                .attr("transform", "translate("+  (578 + mv) + "," + (108 + mv) + ")");
            lungs.selectAll(".fev4-label")
                .duration(1200)
                .attr("transform", "translate("+  (643 + mv) + "," + (108 + mv) + ")");
        }
    });

var margin2 = {top:20 , right: 0, bottom: 30, left: 40},
    width2 = 1000 - margin2.left - margin2.right,
    height2 = 500 - margin2.top - margin2.bottom;

var svg2 = d3.select("#lung").append("svg")
    .attr("width", width2 - 200)
    .attr("height", height2 + margin2.top + margin2.bottom)
    .append("g");

var mv = 0;
svg2.append("line")
    .attr("class", "line-label")
    .attr("x", 0)
    .attr("y", 0)
    .attr("x2", 140)
    .attr("y2", 0)
    .attr("stroke-width", 1)
    .attr("transform", "translate("+ (350 + mv) + "," + (96.5 + mv) + ")")
    .attr("stroke", "black");
svg2.append("clipPath")       // define a clip path
    .attr("id", "ellipse-clip") // give the clipPath an ID
    .append("rect") // shape it as an ellipse
    .attr("class", "clip-path")
    .attr("x", -1)         // position the x-centre
    .attr("y", 0)      // position the y-centre
    .attr("width", 30)
    .attr("height", 30)
    .attr("transform", "translate("+ -1 + "," + 0 + ")scale(19)");
svg2.append("path")
    .attr("d", "M10.594,7.867c-0.021-0.963-0.772-3.75-2.625-3.75 c-2.073,0-4.413,2.957-5.325,4.331C0.532,11.629,0.08,13.424,0,15.937v3.837v0.035c0.005,0.757,0.162,1.855,0.436,2.342 c1.243,2.211,4.839,0.577,6.24-0.295c1.201-0.748,1.962-1.426,2.859-2.485c0.324-0.383,0.783-1.133,0.993-1.631c0.831-1.964,0.434-3.927,0.442-6.125c0.003-0.6-0.096-0.77-0.096-1.31c0.274-0.073,0.383-0.227,0.617-0.414c0.259-0.206,0.353-0.356,0.602-0.524c0.335,0.225,0.643,0.584,1.031,0.844c0,1.944-0.45,4.642,0.035,6.528c0.355,1.385,1.31,2.724,2.331,3.669c0.207,0.191,0.301,0.229,0.517,0.421c1.522,1.36,5.836,3.486,7.26,1.682C23.785,21.854,24,20.917,24,19.773v-3.851c-0.083-2.525-0.54-4.47-2.643-7.569c-0.168-0.248-0.294-0.402-0.478-0.647c-0.188-0.249-0.334-0.466-0.521-0.697c-0.657-0.804-1.625-1.782-2.525-2.35c-1.353-0.853-2.786-0.969-3.647,0.612c-0.279,0.512-0.723,1.733-0.779,2.408c-0.59-0.679-0.473-0.383-0.469-1.594l0.004-4.13c0.007-0.99-0.296-1.215-1.035-1.215c-1.161,0-0.844,1.77-0.844,3.376c0,0.688-0.001,1.375,0,2.062c0.001,0.263,0.028,0.781-0.02,1.012C10.994,7.425,10.78,7.73,10.594,7.867z")
    .attr("stroke", "black")
    .attr("fill", "red")
    .attr("stroke-width", "0.1")
    .attr("transform", "translate("+ margin2.left + "," + margin2.top + ")scale(19)");
svg2.append("path")
    .attr("d", d="M10.594,7.867c-0.021-0.963-0.772-3.75-2.625-3.75 c-2.073,0-4.413,2.957-5.325,4.331C0.532,11.629,0.08,13.424,0,15.937v3.837v0.035c0.005,0.757,0.162,1.855,0.436,2.342 c1.243,2.211,4.839,0.577,6.24-0.295c1.201-0.748,1.962-1.426,2.859-2.485c0.324-0.383,0.783-1.133,0.993-1.631c0.831-1.964,0.434-3.927,0.442-6.125c0.003-0.6-0.096-0.77-0.096-1.31c0.274-0.073,0.383-0.227,0.617-0.414c0.259-0.206,0.353-0.356,0.602-0.524c0.335,0.225,0.643,0.584,1.031,0.844c0,1.944-0.45,4.642,0.035,6.528c0.355,1.385,1.31,2.724,2.331,3.669c0.207,0.191,0.301,0.229,0.517,0.421c1.522,1.36,5.836,3.486,7.26,1.682C23.785,21.854,24,20.917,24,19.773v-3.851c-0.083-2.525-0.54-4.47-2.643-7.569c-0.168-0.248-0.294-0.402-0.478-0.647c-0.188-0.249-0.334-0.466-0.521-0.697c-0.657-0.804-1.625-1.782-2.525-2.35c-1.353-0.853-2.786-0.969-3.647,0.612c-0.279,0.512-0.723,1.733-0.779,2.408c-0.59-0.679-0.473-0.383-0.469-1.594l0.004-4.13c0.007-0.99-0.296-1.215-1.035-1.215c-1.161,0-0.844,1.77-0.844,3.376c0,0.688-0.001,1.375,0,2.062c0.001,0.263,0.028,0.781-0.02,1.012C10.994,7.425,10.78,7.73,10.594,7.867z")
    .attr("fill", "lightblue")
    .attr("stroke", "black")
    .attr("stroke-width", "0.1")
    .attr("clip-path", "url(#ellipse-clip)")
    .attr("transform", "translate("+ margin2.left + "," + margin2.top + ")scale(19)");
svg2.append("circle")
    .attr("class", "circle-label")
    .attr("cx", 480)
    .attr("cy", 75)
    .attr("r", 30)
    .attr("stroke", "black")
    .attr("stroke-width", "3")
    .attr("fill", "transparent")
    .attr("transform", "translate("+ (margin2.left + mv) + "," + (margin2.top + mv) + ")");
svg2.append("text")
    .attr("class", "text1-label")
    .attr("transform", "translate("+  (503 + mv) + "," + (89 + mv) + ")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", "black")
    .text("0.0 %");
svg2.append("text")
    .attr("class", "text2-label")
    .attr("transform", "translate("+  (505 + mv) + "," + (108 + mv) + ")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", "black")
    .text("less");
svg2.append("circle")
    .attr("class", "circle-label")
    .attr("cx", 543)
    .attr("cy", 75)
    .attr("r", 30)
    .attr("stroke", "lightblue")
    .attr("stroke-width", "3")
    .attr("fill", "transparent")
    .attr("transform", "translate("+ (margin2.left + mv) + "," + (margin2.top + mv) + ")");
svg2.append("circle")
    .attr("class", "circle-label")
    .attr("cx", 606)
    .attr("cy", 75)
    .attr("r", 30)
    .attr("stroke", "red")
    .attr("stroke-width", "3")
    .attr("fill", "transparent")
    .attr("transform", "translate("+ (margin2.left + mv) + "," + (margin2.top + mv) + ")");
svg2.append("text")
    .attr("class", "fev1-label")
    .attr("transform", "translate("+  (570 + mv) + "," + (89 + mv) + ")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", "black")
    .text("0.0");
svg2.append("text")
    .attr("class", "fev2-label")
    .attr("transform", "translate("+  (635 + mv) + "," + (89 + mv) + ")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", "black")
    .text("0.0");
svg2.append("text")
    .attr("class", "fev3-label")
    .attr("transform", "translate("+  (578 + mv) + "," + (108 + mv) + ")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", "black")
    .text("L");
svg2.append("text")
    .attr("class", "fev4-label")
    .attr("transform", "translate("+  (643 + mv) + "," + (108 + mv) + ")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", "black")
    .text("L");

function boy(pos, ypos, color, clas) {
    svg3.append("path")
        .attr("class", clas)
        .attr("d", "M46.004,21.672c5.975,0,10.836-4.861,10.836-10.836S51.979,0,46.004,0c-5.975,0-10.835,4.861-10.835,10.836 S40.029,21.672,46.004,21.672z")
        .attr("stroke", "black")
        .attr("fill", color)
        .attr("stroke-width", "1")
        .attr("transform", "translate(" + pos + "," + ypos + ")scale(0.35)");
    svg3.append("path")
        .attr("class", clas)
        .attr("d", "M68.074,54.008L59.296,26.81c-0.47-1.456-2.036-2.596-3.566-2.596h-1.312H53.48H38.526h-0.938h-1.312 c-1.53,0-3.096,1.14-3.566,2.596l-8.776,27.198c-0.26,0.807-0.152,1.623,0.297,2.24s1.193,0.971,2.041,0.971h2.25 c1.53,0,3.096-1.14,3.566-2.596l2.5-7.75v10.466v0.503v29.166c0,2.757,2.243,5,5,5h0.352c2.757,0,5-2.243,5-5V60.842h2.127v26.166 c0,2.757,2.243,5,5,5h0.352c2.757,0,5-2.243,5-5V57.842v-0.503v-10.47l2.502,7.754c0.47,1.456,2.036,2.596,3.566,2.596h2.25 c0.848,0,1.591-0.354,2.041-0.971S68.334,54.815,68.074,54.008z")
        .attr("stroke", "black")
        .attr("fill", color)
        .attr("stroke-width", "1")
        .attr("transform", "translate(" + pos + "," + ypos + ")scale(0.35)");
}
function girl(pos, ypos, color, clas) {
    svg3.append("path")
        .attr("class", clas)
        .attr("d", "M21.457,12.522c0.229-0.981-1.104-5.02-1.104-5.02c-0.148-0.381-0.857-1.548-2.853-1.56l-3.897,0.012c-1.933-0.107-2.646,0.999-2.825,1.584c0,0-1.295,4.068-1.08,4.984c0.143,0.602,1.218,1.341,2.35,1.88l-2.375,7.245l3.476-0.011l0.009,8.789c0.067,0.677,0.538,0.925,1.116,0.925c0.575,0,1.047-0.228,1.113-0.904h0.358c0.067,0.678,0.535,0.916,1.113,0.916s1.046-0.254,1.115-0.93l0.01-8.796l3.705,0.005l-2.262-7.396C20.435,13.725,21.329,13.066,21.457,12.522z")
        .attr("stroke", "black")
        .attr("fill", color)
        .attr("stroke-width", "0.4")
        .attr("transform", "translate("+ ( pos + 1.8) + "," + ypos + ")scale(0.9)");

    svg3.append("path")
        .attr("class", clas)
        .attr("d", "M46.004,21.672c5.975,0,10.836-4.861,10.836-10.836S51.979,0,46.004,0c-5.975,0-10.835,4.861-10.835,10.836 S40.029,21.672,46.004,21.672z")
        .attr("stroke", "black")
        .attr("fill", color)
        .attr("stroke-width", "1")
        .attr("transform", "translate("+ (pos + 1.3) + "," + (ypos - 3) + ")scale(0.32)");
}

function gender(index, file, filename1, filename2) {
d3.csv(filename1, function(error, data) {
    d3.csv(filename2, function(error2, data2) {
        data.forEach(function(d) {

            d.Age = +d.Age;
            d.Male = +d.Male;
            d.Female = +d.Female;
        });
        data2.forEach(function (d2) {

            d2.Age = +d2.Age;
            d2.Male = +d2.Male;
            d2.Female = +d2.Female;
        });
        var ind = index - 1;
        if(filename1 == "mean_nonsmoker.csv") {
            if(file == "smoke") {
                var femNS = data[ind+6].Female;
                var manNS = data[ind+6].Male;
                var femS = data2[ind].Female;
                var manS = data2[ind].Male;
            } else {
                if(ind < 6) {
                    var femNS = data[ind].Female;
                    var manNS = data[ind].Male;
                    var femS = 0;
                    var manS = 0;
                } else {
                    var femNS = data[ind].Female;
                    var manNS = data[ind].Male;
                    var femS = data2[ind-6].Female;
                    var manS = data2[ind-6].Male;
                }
            }

        } else {
            if(file == "smoke") {
                var femNS = data[ind+6].Female;
                var manNS = data[ind+6].Male;
                var femS = data2[ind].Female;
                var manS = data2[ind].Male;
            } else {
                if(ind < 9) {
                    var femNS = data[ind].Female;
                    var manNS = data[ind].Male;
                    var femS = 0;
                    var manS = 0;
                } else {
                    var femNS = data[ind].Female;
                    var manNS = data[ind].Male;
                    var femS = data2[ind-6].Female;
                    var manS = data2[ind-6].Male;
                }
            }
        }



        var totalM = manS + manNS;
        var totalF = femS + femNS;

    for (var p = 0; p < totalM; p++) {
        var pos = p * 18;
        var ypos = 30;
        if(p < manNS) {
                boy(pos, ypos, "lightblue", "person")
        } else {
                boy(pos, ypos, "red", "person")
        }
    }

    for (var p = 0; p < totalF; p++) {
            var pos = p*18;
            var ypos = 70;
        if(p < femNS) {
            girl(pos, ypos, "lightblue", "person")
        } else {
            girl(pos, ypos, "red", "person")
        }

    }
    });
});
}
var margin3 = {top:20 , right: 20, bottom: 30, left: 40},
    width3 = 1300 - margin3.left - margin3.right,
    height3 = 120 - margin3.top - margin3.bottom;

var svg3 = d3.select("#people").append("svg")
    .attr("transform", "translate(-50,0)")
    .attr("id", "gender")
    .attr("width", width3)
    .attr("height", height3 + margin3.top + margin3.bottom)
    .append("g");
svg3.append("text")
    .attr("transform", "translate("+ 10 + "," + 7 + ")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", "black")
    .style("font-size", "17px")
    .text("Number of males and females in this group:");



gender(13, "", "mean_nonsmoker.csv", "mean_smoker.csv");