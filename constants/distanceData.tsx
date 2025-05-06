const distanceData = [{ distance: 0, time: "Don't Care" }];

const startDistance = 1.0; // in km
const endDistance = 15.0;
const increment = 0.5;
const timePerKm = 15; // in minutes per km

for (let i = startDistance; i <= endDistance; i += increment) {
  distanceData.push({
    distance: parseFloat(i.toFixed(1)), // ensures 1.5, 2.0, etc.
    time: `Approx. ` + Math.round(i * timePerKm) + `min`,
  });
}

export default distanceData;
