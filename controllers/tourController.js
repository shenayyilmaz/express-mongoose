const Tour = require('../models/tourModel');

// 2) ROUTE HANDELERS FUNCTIONS
exports.getAllTours = async (req, res) => {
  try {
    //BUILD QUERY
    // 1 A) Filtering

    let queryObj = { ...req.query };
    const excludedFields = ['fields', 'page', 'sort', 'limit'];

    excludedFields.forEach((el) => {
      delete queryObj[el];
    });

    // 2 B) Advance Filtering
    let queryStr = JSON.stringify(queryObj);
    //() found
    //b exactly gte or gt ..
    // g can found many times not first one and stop
    queryStr = queryStr.replace(
      /\b(gte| gt | lte | lt )\b/g,
      (match) => `$${match}`
    );

    const query = Tour.find(JSON.parse(queryStr));

    // 2) SORTING
    //query.sort('difficulty price')  once difficulty gore siraliyo ayni varsa ornek easy easy ikitane bunlarida kendi arasinda price gore olucak sekilde siraliyo

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query.sort(sortBy);
    } else {
      query.sort('-createdAt');
    }

    // 3) Field limiting
    // query.select(name difficulty price)  gibi
    if (req.query.fields) {
      let fields = req.query.fields.split(',').join(' ');
      query.select(fields);
    } else {
      query.select('-__v');
    }
    //EXECUTE QUERY
    const tours = await query;

    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.lenght,
      data: { tours },
    });
  } catch (error) {
    res.status(404).json({ status: 'fail', message: error });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({ status: 'success', data: { tour } });
  } catch (error) {
    res.status(404).json({ status: 'fail', message: error });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({ status: 'success', data: { tour: newTour } });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ status: 'success', data: { tour } });
  } catch (error) {
    res.status(404).json({ status: 'fail', message: error });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(404).json({ status: 'fail', message: error });
  }
};
