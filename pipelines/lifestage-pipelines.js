const sort = query => {
    const sort = query.sort;
    delete query['sort'];

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

    const duration = sort && sort.slice(0,8) === 'duration' ? [{
        '$addFields': {
            duration: {
                $subtract: ['$date_end', '$date_start']
            }
        }
    }] : [];

    return [
        {
            '$match': query
        }, 
        ...duration,
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
    generateSortPipeline: sort
};