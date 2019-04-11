var url = "https://injoyserver.azurewebsites.net/positions"
var map

function initMap() {    
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function(users, status){
            
            if (users.length >= 1)
            {
                lastUser = users[users.length - 1]
                lastPosition = lastUser.locations[lastUser.locations.length - 1]    
                
                map = new google.maps.Map(document.getElementById('map'), {
                    center: lastPosition,
                    zoom: 15
                })

                for(var location of lastUser.locations)
                {
                    addMarker(lastUser.user, location.lat, location.lng);
                }

                if (lastUser.locals.length >= 1) {
                    for(var local of lastUser.locals)
                    {
                        addBart(lastUser.user, local.arrival, local.departure, local.lat, local.lng);
                    }
                }

            } else {
                alert("não há dados de localização a serem apresentados")
            }
        }
    })
}

function addMarker(user, lat, lng) {

    new google.maps.Marker({
        title: user,
        position: {
            lat: lat,
            lng: lng
        },
        animation: google.maps.Animation.DROP,
        map: map
    })  
}

function addBart(user, arrival, departure, lat, lng) {

    let googleUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + lat + "," + lng + "&rankby=distance&type=establishment&key=AIzaSyCf_4B1NNe-B_g1tLpUAr9djlFVgAVrtZk"

    $.ajax({
        url: googleUrl,
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function(res, status) {

            if (res.results.length > 2) {

                new google.maps.Marker({
                    title: user + ' entre as ' + new Date(arrival) + ' e as ' + new Date(departure) + ' deve ter ido em: 1: ' + res.results[0].name + " / 2: " + res.results[1].name + " / 3: " + res.results[2].name,
                    position: {
                        lat: lat,
                        lng: lng
                    },
                    icon: 'images/bart-icon.png',
                    animation: google.maps.Animation.DROP,
                    map: map
                }) 

            }

        }
    })
}

function postLocations() {
    for(var location of locations) {

        data = JSON.stringify([{ user: "dao", lat: location.lat, lng: location.lng, timeStamp: location.timeStamp }])

        $.ajax({
            url: "http://localhost/positions",
            type: "POST",
            dataType: "json",
            data: data,
            contentType: "application/json; charset=utf-8",
            success: function(users, status) { }
        })
    }
}

var locations = [
{
	"lng": -51.2206905,
	"lat": -30.0390307,
	"timeStamp": 1554936717059
}, {
	"lng": -51.2206999,
	"lat": -30.0389892,
	"timeStamp": 1554936753245
}, {
	"lng": -51.2207097,
	"lat": -30.0390377,
	"timeStamp": 1554936793473
}, {
	"lng": -51.2206522,
	"lat": -30.0389999,
	"timeStamp": 1554936833360
}, {
	"lng": -51.2206546,
	"lat": -30.0390105,
	"timeStamp": 1554936993911
}, {
	"lng": -51.2206549,
	"lat": -30.0390012,
	"timeStamp": 1554937015366
}, {
	"lng": -51.2206588,
	"lat": -30.0390098,
	"timeStamp": 1554937096043
}, {
	"lng": -51.2206523,
	"lat": -30.039,
	"timeStamp": 1554937136015
}, {
	"lng": -51.2206632,
	"lat": -30.0390078,
	"timeStamp": 1554937336538
}, {
	"lng": -51.2206508,
	"lat": -30.0389983,
	"timeStamp": 1554937376542
}, {
	"lng": -51.2206449,
	"lat": -30.0389901,
	"timeStamp": 1554937577072
}, {
	"lng": -51.2206512,
	"lat": -30.0389996,
	"timeStamp": 1554937657512
}, {
	"lng": -51.220647,
	"lat": -30.038991,
	"timeStamp": 1554937817644
}, {
	"lng": -51.2206527,
	"lat": -30.0389997,
	"timeStamp": 1554937857782
}, {
	"lng": -51.2206521,
	"lat": -30.0389902,
	"timeStamp": 1554937897634
}, {
	"lng": -51.220651,
	"lat": -30.0389999,
	"timeStamp": 1554937977982
}, {
	"lng": -51.2206673,
	"lat": -30.038995,
	"timeStamp": 1554938017932
}, {
	"lng": -51.2206511,
	"lat": -30.0389995,
	"timeStamp": 1554938058218
}, {
	"lng": -51.2206514,
	"lat": -30.0389895,
	"timeStamp": 1554938178625
}, {
	"lng": -51.2206514,
	"lat": -30.0389996,
	"timeStamp": 1554938218384
}, {
	"lng": -51.2206728,
	"lat": -30.0390259,
	"timeStamp": 1554938498318
}, {
	"lng": -51.2208703,
	"lat": -30.039163,
	"timeStamp": 1554938540577
}, {
	"lng": -51.220657,
	"lat": -30.0390048,
	"timeStamp": 1554938560798
}, {
	"lng": -51.2206068,
	"lat": -30.0389766,
	"timeStamp": 1554938629131
}, {
	"lng": -51.2194298,
	"lat": -30.0398823,
	"timeStamp": 1554938630116
}, {
	"lng": -51.2189028,
	"lat": -30.0398245,
	"timeStamp": 1554938646726
}, {
	"lng": -51.2172158,
	"lat": -30.0403714,
	"timeStamp": 1554938689040
}, {
	"lng": -51.2162004,
	"lat": -30.0412814,
	"timeStamp": 1554938709781
}, {
	"lng": -51.2155895,
	"lat": -30.0406298,
	"timeStamp": 1554938750916
}, {
	"lng": -51.2146908,
	"lat": -30.0401105,
	"timeStamp": 1554938771870
}, {
	"lng": -51.2120806,
	"lat": -30.0386524,
	"timeStamp": 1554938815590
}, {
	"lng": -51.210993,
	"lat": -30.0378249,
	"timeStamp": 1554938835824
}, {
	"lng": -51.208106,
	"lat": -30.0370289,
	"timeStamp": 1554938877574
}, {
	"lng": -51.2064399,
	"lat": -30.0371436,
	"timeStamp": 1554938897827
}, {
	"lng": -51.2049161,
	"lat": -30.0375167,
	"timeStamp": 1554938920392
}, {
	"lng": -51.2035826,
	"lat": -30.0380667,
	"timeStamp": 1554938941259
}, {
	"lng": -51.2022011,
	"lat": -30.0386958,
	"timeStamp": 1554938963494
}, {
	"lng": -51.2007437,
	"lat": -30.0391635,
	"timeStamp": 1554938982999
}, {
	"lng": -51.1994072,
	"lat": -30.0395658,
	"timeStamp": 1554939005012
}, {
	"lng": -51.1979431,
	"lat": -30.0398721,
	"timeStamp": 1554939025595
}, {
	"lng": -51.1963881,
	"lat": -30.0403248,
	"timeStamp": 1554939046633
}, {
	"lng": -51.1955986,
	"lat": -30.0402609,
	"timeStamp": 1554939066941
}, {
	"lng": -51.1939418,
	"lat": -30.040393,
	"timeStamp": 1554939110417
}, {
	"lng": -51.1933289,
	"lat": -30.0404568,
	"timeStamp": 1554939130726
}, {
	"lng": -51.1922262,
	"lat": -30.0407706,
	"timeStamp": 1554939153242
}, {
	"lng": -51.1915019,
	"lat": -30.0415773,
	"timeStamp": 1554939173612
}, {
	"lng": -51.1909158,
	"lat": -30.0424146,
	"timeStamp": 1554939194826
}, {
	"lng": -51.1898342,
	"lat": -30.0427376,
	"timeStamp": 1554939217846
}, {
	"lng": -51.1887863,
	"lat": -30.0431199,
	"timeStamp": 1554939237647
}, {
	"lng": -51.1865218,
	"lat": -30.0435381,
	"timeStamp": 1554939280240
}, {
	"lng": -51.185063,
	"lat": -30.0438374,
	"timeStamp": 1554939301110
}, {
	"lng": -51.1820973,
	"lat": -30.0434095,
	"timeStamp": 1554939344719
}, {
	"lng": -51.1808855,
	"lat": -30.0431531,
	"timeStamp": 1554939364761
}, {
	"lng": -51.1781513,
	"lat": -30.0412019,
	"timeStamp": 1554939553665
}, {
	"lng": -51.1782513,
	"lat": -30.0411338,
	"timeStamp": 1554939584409
}, {
	"lng": -51.1782271,
	"lat": -30.0411481,
	"timeStamp": 1554939613888
}, {
	"lng": -51.1781826,
	"lat": -30.0411858,
	"timeStamp": 1554939682919
}, {
	"lng": -51.1781704,
	"lat": -30.041182,
	"timeStamp": 1554939684267
}, {
	"lng": -51.178199,
	"lat": -30.0411691,
	"timeStamp": 1554939711556
}, {
	"lng": -51.1781956,
	"lat": -30.0411785,
	"timeStamp": 1554939718870
}, {
	"lng": -51.1781716,
	"lat": -30.0411812,
	"timeStamp": 1554939743411
}, {
	"lng": -51.1781902,
	"lat": -30.0411736,
	"timeStamp": 1554939822967
}, {
	"lng": -51.1781636,
	"lat": -30.0411828,
	"timeStamp": 1554939863177
}, {
	"lng": -51.178207,
	"lat": -30.0411776,
	"timeStamp": 1554939884543
}, {
	"lng": -51.1781767,
	"lat": -30.0411796,
	"timeStamp": 1554939927387
}, {
	"lng": -51.1782057,
	"lat": -30.0411839,
	"timeStamp": 1554939947800
}, {
	"lng": -51.1781776,
	"lat": -30.0411793,
	"timeStamp": 1554939969007
}, {
	"lng": -51.1782025,
	"lat": -30.0411673,
	"timeStamp": 1554940113802
}, {
	"lng": -51.1782187,
	"lat": -30.0411565,
	"timeStamp": 1554940134821
}, {
	"lng": -51.1782103,
	"lat": -30.0411734,
	"timeStamp": 1554940156323
}, {
	"lng": -51.1782077,
	"lat": -30.0411591,
	"timeStamp": 1554940176574
}, {
	"lng": -51.1781936,
	"lat": -30.0411765,
	"timeStamp": 1554940198861
}, {
	"lng": -51.1781829,
	"lat": -30.0411782,
	"timeStamp": 1554940220650
}, {
	"lng": -51.1782053,
	"lat": -30.041184,
	"timeStamp": 1554940242294
}, {
	"lng": -51.1781837,
	"lat": -30.0411764,
	"timeStamp": 1554940282002
}, {
	"lng": -51.1781731,
	"lat": -30.0411805,
	"timeStamp": 1554940322873
}, {
	"lng": -51.1781876,
	"lat": -30.0411823,
	"timeStamp": 1554940344950
}, {
	"lng": -51.1781955,
	"lat": -30.0411601,
	"timeStamp": 1554940366916
}, {
	"lng": -51.1781787,
	"lat": -30.04118,
	"timeStamp": 1554940388616
}, {
	"lng": -51.1781931,
	"lat": -30.0411792,
	"timeStamp": 1554940429976
}, {
	"lng": -51.1781698,
	"lat": -30.0411815,
	"timeStamp": 1554940450880
}, {
	"lng": -51.1782517,
	"lat": -30.0411618,
	"timeStamp": 1554945162721
}, {
	"lng": -51.1781294,
	"lat": -30.0412147,
	"timeStamp": 1554945228690
}, {
	"lng": -51.1781526,
	"lat": -30.0412281,
	"timeStamp": 1554945286644
}, {
	"lng": -51.1780128,
	"lat": -30.04124,
	"timeStamp": 1554945287922
}, {
	"lng": -51.1782833,
	"lat": -30.0416199,
	"timeStamp": 1554945330705
}, {
	"lng": -51.1816786,
	"lat": -30.043199,
	"timeStamp": 1554945367006
}, {
	"lng": -51.1848967,
	"lat": -30.0437298,
	"timeStamp": 1554945408492
}, {
	"lng": -51.1866183,
	"lat": -30.0435575,
	"timeStamp": 1554945429772
}, {
	"lng": -51.1894613,
	"lat": -30.042752,
	"timeStamp": 1554945471777
}, {
	"lng": -51.1925944,
	"lat": -30.0408507,
	"timeStamp": 1554945514134
}, {
	"lng": -51.1944387,
	"lat": -30.0402431,
	"timeStamp": 1554945536006
}, {
	"lng": -51.1981011,
	"lat": -30.0397756,
	"timeStamp": 1554945577660
}, {
	"lng": -51.199558,
	"lat": -30.0392988,
	"timeStamp": 1554945596804
}, {
	"lng": -51.2025898,
	"lat": -30.0386009,
	"timeStamp": 1554945640131
}, {
	"lng": -51.203923,
	"lat": -30.0377661,
	"timeStamp": 1554945663071
}, {
	"lng": -51.2057623,
	"lat": -30.0372216,
	"timeStamp": 1554945683757
}, {
	"lng": -51.2071639,
	"lat": -30.0370483,
	"timeStamp": 1554945705943
}, {
	"lng": -51.209111,
	"lat": -30.036963,
	"timeStamp": 1554945748550
}, {
	"lng": -51.2103016,
	"lat": -30.0375201,
	"timeStamp": 1554945768630
}, {
	"lng": -51.2115862,
	"lat": -30.0382948,
	"timeStamp": 1554945791321
}, {
	"lng": -51.2130602,
	"lat": -30.039344,
	"timeStamp": 1554945812022
}, {
	"lng": -51.2155587,
	"lat": -30.0406494,
	"timeStamp": 1554945853384
}, {
	"lng": -51.2164053,
	"lat": -30.0410463,
	"timeStamp": 1554945874302
}, {
	"lng": -51.2172686,
	"lat": -30.0416784,
	"timeStamp": 1554945900552
}, {
	"lng": -51.2190612,
	"lat": -30.0401675,
	"timeStamp": 1554945938205
}, {
	"lng": -51.2202746,
	"lat": -30.0392171,
	"timeStamp": 1554945974930
}, {
	"lng": -51.2205921,
	"lat": -30.0389882,
	"timeStamp": 1554945978207
}, {
	"lng": -51.2206465,
	"lat": -30.0389956,
	"timeStamp": 1554945999904
}, {
	"lng": -51.2208757,
	"lat": -30.0391458,
	"timeStamp": 1554946022930
}, {
	"lng": -51.2206426,
	"lat": -30.0390102,
	"timeStamp": 1554946064852
}, {
	"lng": -51.2206519,
	"lat": -30.0390047,
	"timeStamp": 1554946105810
}, {
	"lng": -51.220668,
	"lat": -30.0389948,
	"timeStamp": 1554946144730
}, {
	"lng": -51.2206916,
	"lat": -30.0390307,
	"timeStamp": 1554946184823
}, {
	"lng": -51.2206659,
	"lat": -30.0390305,
	"timeStamp": 1554946224672
}, {
	"lng": -51.2206628,
	"lat": -30.0390148,
	"timeStamp": 1554946265120
}, {
	"lng": -51.2206653,
	"lat": -30.0389853,
	"timeStamp": 1554946305322
}, {
	"lng": -51.2206779,
	"lat": -30.0390188,
	"timeStamp": 1554946391990
}, {
	"lng": -51.2206658,
	"lat": -30.0390264,
	"timeStamp": 1554946448021
}, {
	"lng": -51.2206597,
	"lat": -30.0390047,
	"timeStamp": 1554946469683
}, {
	"lng": -51.2206664,
	"lat": -30.0390268,
	"timeStamp": 1554946515909
}, {
	"lng": -51.2206782,
	"lat": -30.0390191,
	"timeStamp": 1554946534503
}, {
	"lng": -51.2206668,
	"lat": -30.0389941,
	"timeStamp": 1554946596812
}, {
	"lng": -51.2206777,
	"lat": -30.039006,
	"timeStamp": 1554946639142
}, {
	"lng": -51.2206663,
	"lat": -30.0390249,
	"timeStamp": 1554946659950
}, {
	"lng": -51.2206702,
	"lat": -30.0390121,
	"timeStamp": 1554946683066
}, {
	"lng": -51.2206668,
	"lat": -30.0390296,
	"timeStamp": 1554946703665
}, {
	"lng": -51.2206947,
	"lat": -30.0390352,
	"timeStamp": 1554946765120
}, {
	"lng": -51.2205872,
	"lat": -30.0389657,
	"timeStamp": 1554946786765
}, {
	"lng": -51.2208327,
	"lat": -30.0389053,
	"timeStamp": 1554946829001
}, {
	"lng": -51.2213431,
	"lat": -30.03808,
	"timeStamp": 1554946871696
}, {
	"lng": -51.2210584,
	"lat": -30.0378663,
	"timeStamp": 1554946890144
}, {
	"lng": -51.2208678,
	"lat": -30.0381487,
	"timeStamp": 1554946930859
}, {
	"lng": -51.2210188,
	"lat": -30.0381958,
	"timeStamp": 1554946952489
}, {
	"lng": -51.221374,
	"lat": -30.038204,
	"timeStamp": 1554946994417
}, {
	"lng": -51.22127,
	"lat": -30.038227,
	"timeStamp": 1554947034590
}, {
	"lng": -51.2213812,
	"lat": -30.0382134,
	"timeStamp": 1554947057014
}, {
	"lng": -51.2215207,
	"lat": -30.0382268,
	"timeStamp": 1554947098442
}, {
	"lng": -51.2213896,
	"lat": -30.0382257,
	"timeStamp": 1554947121259
}, {
	"lng": -51.2210384,
	"lat": -30.0386589,
	"timeStamp": 1554947159037
}, {
	"lng": -51.2205903,
	"lat": -30.0389855,
	"timeStamp": 1554947200901
}, {
	"lng": -51.2207031,
	"lat": -30.039045,
	"timeStamp": 1554947242005
}, {
	"lng": -51.2206655,
	"lat": -30.0390266,
	"timeStamp": 1554947283769
}, {
	"lng": -51.220642,
	"lat": -30.0390131,
	"timeStamp": 1554947304610
}, {
	"lng": -51.2206549,
	"lat": -30.0390172,
	"timeStamp": 1554947472172
}, {
	"lng": -51.2206421,
	"lat": -30.039012,
	"timeStamp": 1554947493888
}, {
	"lng": -51.2206527,
	"lat": -30.0390154,
	"timeStamp": 1554947515850
}, {
	"lng": -51.2206414,
	"lat": -30.0390123,
	"timeStamp": 1554947537952
}, {
	"lng": -51.2206539,
	"lat": -30.0390022,
	"timeStamp": 1554947623314
}, {
	"lng": -51.2207047,
	"lat": -30.0390227,
	"timeStamp": 1554947643643
}, {
	"lng": -51.2206772,
	"lat": -30.0390305,
	"timeStamp": 1554947684768
}, {
	"lng": -51.2206585,
	"lat": -30.0390157,
	"timeStamp": 1554947765730
}, {
	"lng": -51.2206774,
	"lat": -30.0390297,
	"timeStamp": 1554947786549
}, {
	"lng": -51.2206922,
	"lat": -30.0390396,
	"timeStamp": 1554947807647
}, {
	"lng": -51.2206579,
	"lat": -30.0390079,
	"timeStamp": 1554947828857
}]