const fetchLifestagesPipeline = query => {

    const getSortMethod = sort => {
        switch (sort) {
            case 'yearasc':
                return {date_start: 1, date_end: 1}
            case 'yeardesc':
                return {date_start: -1, date_end: -1}
            case 'durationasc':
                return {duration: 1}
            case 'durationdesc':
                return {duration: -1}
            default:
                return {date_start: -1, date_end: -1}
        }
    };

    const searchStage = query.search ? [{
        '$search': {
            index: 'default',
            text: {
                query: query.search,
                path: ['title','description','hard_skills','soft_skills','achievements','date_start','date_end','type']
            }
        }
    }] : [];
    delete query['search'];


    const sort = query.sort;
    const durationStage = sort && sort.slice(0,8) === 'duration' ? [{
        '$addFields': {
            duration: {
                $subtract: ['$date_end', '$date_start']
            }
        }
    }] : [];
    delete query['sort'];

    return [
        ...searchStage,
        {
            '$match': query
        }, 
        ...durationStage,
        {
            '$sort': getSortMethod(sort)
        }, {
            '$project': {
                'date_start': 1,
                'date_end': 1,
                'title': 1,
                'hard_skills': 1,
                'soft_skills': 1
            }
        }
    ];
};

module.exports = {
    generateFetchPipeline: fetchLifestagesPipeline
};