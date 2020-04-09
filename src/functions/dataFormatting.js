export const loadData = (data) => new Promise((resolve, reject) => {
    setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), 1);
  });