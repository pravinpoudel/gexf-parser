(() => {

    let fs = require("fs");
    let gexf = require("gexf");
    let path = require('path');

    let xMax = 0;
    let xMin = 0;

    let yMin = 0;
    let yMax = 0;

    let gexf_file = fs.readFileSync('./files/revo_run3.gexf', 'utf-8');

    let graph = gexf.parse(gexf_file);

    graph.nodes.forEach((node, index) => {
        let id = node.id;
        let nodeIdData = id.match(/\d+/g);
        //default cluster
        let clusterInt = 1;
        //mean there is cluster data 
        if (nodeIdData.length > 1) {
            [nodeCluster, nodeLocalIndex] = nodeIdData;
            clusterInt = nodeCluster;
        }
        //there is no cluster data so assume all are in same cluster
        node.cluster = clusterInt;
        // let xPosition = Number(node.viz.position.x);
        // let yPosition = Number(node.viz.position.y);

        // if (xPosition > xMax) {
        //     xMax = xPosition;
        // }
        // if (xPosition < xMin) {
        //     xMin = xPosition
        // }
        // if (yPosition > yMax) {
        //     yMax = yPosition;
        // }
        // if (yPosition < yMin) {
        //     yMin = yPosition
        // }
    });

    graph.meta.xMin = xMin;
    graph.meta.xMax = xMax;

    graph.meta.yMin = yMin;
    graph.meta.yMax = yMax;

    //need to be extracted as a meta data;
    let clusterSize = 48;

    graph.edges.forEach((edge, index) => {
        let source = edge.source;
        let target = edge.target;

        let sourceSearchResult = source.match(/\d+/g);
        let targetSearchResult = target.match(/\d+/g);
        let sourceIndex;
        let targetIndex;

        if (sourceSearchResult.length > 1) {
            //assign the source and destination based on cluster size
            [sCluster, sSelfIndex] = sourceSearchResult;
            [tCluster, tSelfIndex] = targetSearchResult;
            sourceIndex = Number(sourceSearchResult[0]) * clusterSize + Number(sourceSearchResult[1]);
            targetIndex = Number(targetSearchResult[0]) * clusterSize + Number(targetSearchResult[1]);

        } else {
            sourceIndex = Number(sourceSearchResult[0]);
            targetIndex = Number(targetSearchResult[0]);
        }
        // source = source.substring(1, source.length - 1);
        // [sCluster, sSelfIndex] = source.split(",");
        // let sourceIndex = Number(sCluster) * 48 + Number(sSelfIndex);
        edge.source = sourceIndex;
        edge.target = targetIndex;
    });

    let graph_json = JSON.stringify(graph);

    fs.readFile(path.join(__dirname, "./mygraph_3_regex.json"), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            fs.writeFile("mygraph_3_regex.json", graph_json, 'utf8', () => { console.log("please check the json file") });
        }
    })
})()