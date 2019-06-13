
export function getData(){
	return [{
		date: "2019-07-01",
		agenda: {
			type: "FeatureCollection",
			features: [{
				type: "Feature",
				geometry: {
					type: "Point",
					coordinates: [4.026938, 50.942933]
				},
				properties: {
					title: "Vertrek",
					info: "Vertrek op het VTI",
					additionalInfo: "Additional Info",
					icon: "directions_bus"
				}
			}, {
				type: "Feature",
				geometry: {
					type: "LineString",
					coordinates: [[6.766791199999943, 51.2876146], [23.948415599999976,37.93564670000001]]
				},
				properties: {
					title: "Vertrek",
					info: "Vertrek op het VTI",
					icon: "directions_bus"
				}
			}]
		}
	}];
}