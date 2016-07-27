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
          var oPath = [0]
            for (entry in files) {

                var pathArr = files[entry].path_lower.split('/');
                var pathNoZero = pathArr.splice(1,pathArr.length);
                console.log(pathNoZero);

                var num = 1;
                var newa = pathArr.splice(1,num);
                console.log(newa);
                function recurThis(pathArr, oDB) {

                    // console.log(oDB);
                    if (!(pathArr in oDB)) {
                        organizedDB[pathArr] = files[entry];
                        console.log("no file, created!");

                    } else {
                        console.log("file, going deeper");


                    }

                }

                recurThis(pathArr, organizedDB);
                console.log(organizedDB) //
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
