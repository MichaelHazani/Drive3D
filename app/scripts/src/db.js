// Programmatic
var organizedDB = {};

var dbx = new Dropbox({
    accessToken: 'teyD2v5ZoUAAAAAAAAAAFqFsogr2_RN1uKfRkBWwFUqEWvFckbwD4la50O6IbKu0'
});
dbx.filesListFolder({
        path: '',
        recursive: true
    })
    .then(function(response) {
            var files = response.entries;
            turnToDb(files);

            function turnToDb(files) {

                for (entry in files) {

                    var pathArr = files[entry].path_lower.split('/');
                    var num = 1;
                    var pathLev = pathArr[num];

                    function recurThis(pathLev, oDB) {

                        if (!(pathLev[0] in oDB[0])) {
                            organizedDB[pathLev] = files[entry];
                            console.log("no file, created!");

                        } else {
                          console.log("file, going deeper");
                          num++;
                          pathLev.push[pathArr[num]];
                          oDB.push([pathLev]);
                          console.log(oDB, pathLev);
                          console.log ("pathLev: " + [pathLev]);
                          recurThis(pathLev, oDB);
                        }
                        console.log(organizedDB)
                      }

recurThis([pathLev], [organizedDB]);
                        //
                        // if (!(pathArr[1] in organizedDB)) {
                        //     // console.log("creating first level!");
                        //     organizedDB[pathArr[1]] = files[entry];
                        // } else {
                        //     if (!(pathArr[2] in organizedDB[pathArr[1]])) {
                        //         // console.log("creating second level!");
                        //         organizedDB[pathArr[1]][pathArr[2]] = files[entry];
                        //     } else {
                        //         if (!(pathArr[3] in organizedDB[pathArr[1]][pathArr[2]])) {
                        //             // console.log("creating third level!");
                        //             organizedDB[pathArr[1]][pathArr[2]][pathArr[3]] = files[entry];
                        //         } else {
                        //             if (!(pathArr[4] in organizedDB[pathArr[1]][pathArr[2]][pathArr[3]])) {
                        //                 // console.log("creating fourth level!");
                        //                 organizedDB[pathArr[1]][pathArr[2]][pathArr[3]][pathArr[4]] = files[entry];
                        //             } else {
                        //                 if (!(pathArr[5] in organizedDB[pathArr[1]][pathArr[2]][pathArr[3]][pathArr[4]])) {
                        //                     // console.log("creating fifth level!");
                        //                     organizedDB[pathArr[1]][pathArr[2]][pathArr[3]][pathArr[4]][pathArr[5]] = files[entry];
                        //                 } else {
                        //                     if (!(pathArr[6] in organizedDB[pathArr[1]][pathArr[2]][pathArr[3]][pathArr[4]][pathArr[5]])) {
                        //                         // console.log("creating sixth level!");
                        //                         organizedDB[pathArr[1]][pathArr[2]][pathArr[3]][pathArr[4]][pathArr[5]][pathArr[6]] = files[entry];
                        //                     }
                        //                 }
                        //             }
                        //         }
                        //     }
                        // }
                    }
                    // console.log(organizedDB);
                }


            });
