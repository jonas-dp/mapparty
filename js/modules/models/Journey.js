let journeyData;

export function setData(data){
	journeyData = data;
}

export function findIndexByDate(date){
	return journeyData.findIndex(day => day.date === date);
}

export function getDayAgenda(index){
	return journeyData[index].agenda;
}

export function getDayDate(index){
	return new Date(journeyData[index].date);
}

export function getNumberOfDays(){
	return journeyData.length;
}