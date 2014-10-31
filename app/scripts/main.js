/*global d3:false*/
'use strict';

var scheduleData;

var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 800 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

var tooltipHeight = height-100,
	tooltipWidth = 70,
	tooltipOffset = (height-tooltipHeight)/2;

var seasons = [2009, 2010, 2011, 2012, 2013, 2014];

var xScale = d3.scale.linear()
	.range([margin.left, width]);

var yScale = d3.scale.linear()
    .range([height, margin.top]);

var yTooltipScale = d3.scale.linear()
	.range([tooltipHeight-tooltipOffset/2, 0])
	.domain([0,31]);

var svg = d3.select('body').select('.svg').append('svg')
	.attr('width', width+margin.left+margin.right)
	.attr('height', height+margin.top+margin.bottom);

var teamsGroup = svg.append('g');

var gridlines = svg.append('g');

var baseline = gridlines.append('line')
	.attr('class', 'base-line')
	.attr('x1',  1);

var tooltip = svg.append('g').attr('class', 'tip hidden');

tooltip.append('rect')
	.attr('width', tooltipWidth)
	.attr('height', height-100);

var tooltipTeams = tooltip.append('g').attr('class', 'tooltip-teams');

var teams = teamsGroup.selectAll('.team');

svg.on('mousemove', function() {
		var mouseX = d3.mouse(this)[0];
		var week = Math.round(xScale.invert(mouseX));
		var rank = [];
		teams.each(function(d){
			if(!isNaN(d.gamesSum[week])){
				rank.push({'team': d.team, 'diff': d.gamesSum[week]});
			}
		});

		rank.sort(function(a,b){ return a.diff - b.diff; });

		var tooltipTeamsData = tooltipTeams.selectAll('.team').data(rank, function(d){
			return d.team;
		});

		var tttdEnter = tooltipTeamsData.enter().append('g')
		.attr('class', 'team');

		tttdEnter.append('svg:image')
			.attr('xlink:href', function(d) { return 'images/' + d.team + '.png'; })
	        .attr('width', 25)
        	.attr('height', 15);

		tttdEnter.append('text')
			.attr('x', 35)
			.attr('dy', 9);

		tooltipTeamsData.transition().duration(60).attr('transform', function(d, i) { return 'translate(0,' + yTooltipScale(i) + ')'; });
		tooltipTeamsData.select('text').text(function(d){ 
			return d.diff; });

		tooltipTeamsData.exit().remove();

		d3.select('.tip')
			.attr('transform', function() { 
				var offset = -10;
				if(mouseX-tooltipWidth+offset<0){
					offset = tooltipWidth+10;
				}
				return 'translate(' + parseFloat(mouseX-tooltipWidth+offset) + ',' + tooltipOffset +')'; })
			.classed('hidden', function() { return rank.length <= 0; });
	})
	.on('mouseleave', function() {
		d3.select('.tip').classed('hidden', true);
	})
	.on('click', function(){
		d3.selectAll('.team').classed('diminish', false).classed('highlight', false);
	});

var line = d3.svg.line()
    .interpolate('linear')
    .x(function(d, i) { return xScale(i); })
    .y(function(d) { return yScale(d); });

var enterLine = d3.svg.line()
	.interpolate('linear')
	.x(function(d,i) { return xScale(i); })
	.y(function() { return yScale(0); });

var seasonGroupEnter = gridlines.selectAll('.season-lines')
	.data(seasons)
	.enter().append('g')
	.attr('class', 'season-group');
	
var seasonLinesEnter = seasonGroupEnter.append('line')
	.attr('class', 'season-line')
	.attr('y1', 0)
	.attr('y2', height);

function update() {
	teams = teams.data(scheduleData);
	var yMax = d3.max(scheduleData, function(d) { return d3.max(d.gamesSum); });
	var yMin = d3.min(scheduleData, function(d) { return d3.min(d.gamesSum); });
	var xMax = d3.max(scheduleData, function(d) { return d.gamesSum.length; });

	yScale.domain([yMin, yMax]);
	xScale.domain([1, xMax]);

	baseline.attr('x2', xScale(xMax)).attr('y1', yScale(0)).attr('y2', yScale(0));
	seasonLinesEnter
		.attr('x1', function(d, i) { return xScale(i*17); })
		.attr('x2', function(d, i) { return xScale(i*17); });

	seasonGroupEnter.append('text')
		.text( function(d) { return d; })
		.attr('x', function(d, i) { return xScale(i*17); })
		.attr('y', height)
		.attr('dy', '1em');

	var teamEnter = teams.enter()
		.append('g')
		.attr('class', function(d) { return d.team + ' team'; })
		.on('click', function(d){
			teams.classed('diminish', function(d1){ return d1 !== d; })
				.classed('highlight', function(d1){ return d1 === d; });
			d3.event.stopPropagation();
		});

	teamEnter.append('path')
		.attr('class', 'line')
		.attr('d', function(d) { return enterLine(d.gamesSum); });

	teams.selectAll('.line').transition().duration(600).ease('linear').attr('d', function(d) { return line(d.gamesSum); });

	teamEnter.append('svg:image')
		.attr('class', 'team-logo')
		.attr('transform', function(d) {
			return 'translate(' + xScale(xMax-1) + ',' + yScale(d.gamesSum[d.gamesSum.length-1]) + ')';
		})
        .attr('xlink:href', function(d) { return 'images/' + d.team + '.png'; })
        .attr('width', 25)
        .attr('height', 15);
}

d3.json('2009-2014.json', function(error, json){
	scheduleData = json;
	if(scheduleData) {
		update();
	}


});