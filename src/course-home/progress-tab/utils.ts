import { getConfig } from "@edx/frontend-platform";

/* eslint-disable import/prefer-default-export */
export const showUngradedAssignments = () =>
  getConfig().SHOW_UNGRADED_ASSIGNMENT_PROGRESS === "true" ||
  getConfig().SHOW_UNGRADED_ASSIGNMENT_PROGRESS === true;

export const getLatestDueDateInFuture = (assignmentTypeGradeSummary) => {
  let latest = null;
  (assignmentTypeGradeSummary ?? []).forEach((assignment) => {
    const assignmentLastGradePublishDate = assignment.lastGradePublishDate;
    if (
      assignmentLastGradePublishDate &&
      (!latest ||
        new Date(assignmentLastGradePublishDate) > new Date(latest)) &&
      new Date(assignmentLastGradePublishDate) > new Date()
    ) {
      latest = assignmentLastGradePublishDate;
    }
  });
  return latest;
};

// Progress API totals cover graded questions; practice/homework may only have problem scores.
export const getSubsectionScore = (subsection) => {
  const number = (value) => (typeof value === "number" && Number.isFinite(value) ? value : undefined);
  const problems = (subsection.problemScores ?? []).reduce((total, problem) => ({
    earned: total.earned + (number(problem.earned) ?? 0),
    possible: total.possible + (number(problem.possible) ?? 0),
  }), { earned: 0, possible: 0 });
  const possible = number(subsection.numPointsPossible);
  if ((!possible || possible <= 0) && problems.possible > 0) return problems;
  return {
    earned: number(subsection.numPointsEarned) ?? problems.earned,
    possible: possible ?? problems.possible,
  };
};

export const hasSubsectionAssignments = (subsection) => {
  const score = getSubsectionScore(subsection);
  return (subsection.problemScores ?? []).length > 0 ||
    subsection.hasGradedAssignment === true ||
    (typeof subsection.assignmentType === "string" && subsection.assignmentType.trim().length > 0) ||
    score.possible > 0 || score.earned > 0;
};
