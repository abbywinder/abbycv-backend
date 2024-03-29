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

    const sort = query.sort && query.sort[0];
    const durationStage = sort && sort.slice(0,8) === 'duration' ? [{
        '$addFields': {
            duration: {
                $subtract: ['$date_end', '$date_start']
            }
        }
    }] : [];
    delete query['sort'];

    const matchQuery = [];

    // regex match solution - chosen due to search results updating as typed and dataset being small
    if (query.search) { 
        if (typeof(query.search) === 'object') query.search = query.search.join(',');
        const fields = ['title','description','hard_skills','soft_skills','achievements','type'];
        matchQuery.push({'$or': fields.map(field => ({ [field]: { $regex: query.search, $options: 'i' } }))});
        delete query['search'];
    };

    Object.keys(query).forEach(key => {
        if (Array.isArray(query[key]) && key !== '$or') {
            matchQuery.push({['$or']: query[key].map(e => ({ [key]: e }))});
        };
    });

    return [
        {
            '$match': matchQuery.length ? { $and: matchQuery } : {}
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
                'soft_skills': 1,
                'link': 1,
                'description': 1,
                'front_image': 1
            }
        }
    ];
};

const fetchSkillsPipeline = () => {
    return [{
        $unwind: {
            path: '$soft_skills',
            preserveNullAndEmptyArrays: false
        }
    }, {
        $group: {
            _id: '$soft_skills',
            count: {
                $sum: 1
            }
        }
    }, {
        $sort: {
            count: -1
        }
    }, {
        $limit: 8
    }]
};

module.exports = {
    generateFetchPipeline: fetchLifestagesPipeline,
    fetchSkillsPipeline: fetchSkillsPipeline
};


// other solutions for searching that would work better for a large dataset
// // search index solution
    // if (query.search) { 
    //     query['$search'] = {
    //         index: 'default',
    //         text: {
    //             query: query.search,
    //             path: ['title','description','hard_skills','soft_skills','achievements','date_start','date_end','type']
    //         }
    //     }
    //     delete query['search'];
    // };

    // // text index solution
    // if (query.search) { 
    //     query['$text'] = {
    //         $search: query.search,
    //         $language: 'en'
    //     } 
    //     delete query['search'];
    // };