// Feedback model placeholder

let feedbackList = [];

const FeedbackModel = {
  findAll: () => feedbackList,
  findById: (id) => feedbackList.find((f) => f.id === id),
  create: (data) => {
    const newFeedback = { id: `feedback_${Date.now()}`, createdAt: new Date(), ...data };
    feedbackList.push(newFeedback);
    return newFeedback;
  },
};

module.exports = FeedbackModel;
