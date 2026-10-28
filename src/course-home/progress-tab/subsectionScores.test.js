import { getSubsectionScore, hasSubsectionAssignments } from './utils';

jest.mock('@edx/frontend-platform', () => ({ getConfig: () => ({}) }));

describe('homework subsection scores', () => {
  it('includes points from ungraded homework when graded totals are zero', () => {
    expect(getSubsectionScore({ numPointsEarned: 0, numPointsPossible: 0,
      problemScores: [{ earned: 2.25, possible: 5 }, { earned: 1, possible: 2 }],
    })).toEqual({ earned: 3.25, possible: 7 });
  });
  it('preserves an explicit graded total, including a zero grade', () => {
    expect(getSubsectionScore({ numPointsEarned: 0, numPointsPossible: 10,
      problemScores: [{ earned: 5, possible: 5 }],
    })).toEqual({ earned: 0, possible: 10 });
  });
  it('keeps assignments without points available as zero totals', () => {
    expect(getSubsectionScore({})).toEqual({ earned: 0, possible: 0 });
  });
  it('uses problem scores if aggregate fields are missing', () => {
    expect(getSubsectionScore({ problemScores: [{ earned: 1, possible: 5 }] }))
      .toEqual({ earned: 1, possible: 5 });
  });
});

it('omits theory-only lectures', () => {
  expect(hasSubsectionAssignments({ showGrades: true, assignmentType: null,
    hasGradedAssignment: false, problemScores: [], numPointsPossible: 0 })).toBe(false);
});
it('retains practice questions and homework awaiting points', () => {
  expect(hasSubsectionAssignments({ problemScores: [{ earned: 0, possible: 0 }] })).toBe(true);
  expect(hasSubsectionAssignments({ assignmentType: 'Homework', numPointsPossible: 0 })).toBe(true);
});
