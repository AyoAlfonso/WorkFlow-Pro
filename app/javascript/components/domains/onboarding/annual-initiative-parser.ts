import * as R from "ramda";

const quarterlyGoalLens = R.lens(R.prop("quarterlyGoals"), R.assoc("quarterlyGoals"));

const getMilestoneValues = quarterlyGoals => {
  return quarterlyGoals.map(qg => {
    if (Array.isArray(qg.milestones)) {
      return qg;
    } else {
      return {
        ...qg,
        milestones: [{ description: "onboarding example" }],
        keyElements: R.values(qg.keyElements),
      };
    }
  });
};

export const parseAnnualInitiative = annualInitiative => {
  return R.pipe(
    R.ifElse(
      R.compose(R.is(Array), R.view(quarterlyGoalLens)),
      R.identity,
      R.pipe(
        R.prop("quarterlyGoals"),
        R.map(quarterlyGoals => getMilestoneValues(quarterlyGoals), R.values(R.__)),
        R.set(quarterlyGoalLens, R.__, annualInitiative),
      ),
    ),
  )(annualInitiative);
};
