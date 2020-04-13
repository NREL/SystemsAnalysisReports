import { loadData } from './dataFormatting';
import jsonData from '../data.json';

test('data exists', () => {
    expect(Object.keys(jsonData).length).toBe(3);
  });

test('data loads asynchronously', () => {
    loadData(jsonData).then(data => {
        expect(Object.keys(data).length).toBe(3)
    });
});