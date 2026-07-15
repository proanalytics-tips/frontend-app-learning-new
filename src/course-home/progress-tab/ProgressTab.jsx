import React from 'react';
import { PluginSlot } from '@openedx/frontend-plugin-framework';
import { useWindowSize } from '@openedx/paragon';
import { useContextId } from '../../data/hooks';

import ProgressTabCertificateStatusSidePanelSlot from '../../plugin-slots/ProgressTabCertificateStatusSidePanelSlot';

import CourseCompletion from './course-completion/CourseCompletion';
import ProgressHeader from './ProgressHeader';

import ProgressTabCertificateStatusMainBodySlot from '../../plugin-slots/ProgressTabCertificateStatusMainBodySlot';
import ProgressTabCourseGradeSlot from '../../plugin-slots/ProgressTabCourseGradeSlot';
import ProgressTabGradeBreakdownSlot from '../../plugin-slots/ProgressTabGradeBreakdownSlot';
import { useModel } from '../../generic/model-store';

const ProgressTab = () => {
  const courseId = useContextId();
  // const { disableProgressGraph } = useModel('progress', courseId);
  const {
    completionSummary,
    disableProgressGraph,
    creditCourseRequirements,

    gradingPolicy,
    sectionScores,
  } = useModel('progress', courseId);

  const { isStaff } = useModel('courseHomeMeta', courseId);

  const windowWidth = useWindowSize().width;
  if (windowWidth === undefined) {
    // Bail because we don't want to load <CertificateStatus/> twice, emitting 'visited' events both times.
    // This is a hacky solution, since the user can resize the screen and still get two visited events.
    // But I'm leaving a larger refactor as an exercise to a future reader.
    return null;
  }

  return (
    <div
      style={{
        maxWidth: "1600px",
        margin: "0 auto",
        width: "100%",
        padding: "0 12px",
      }}
    >
      <PluginSlot
        id="org.openedx.frontend.learning.course_progress_page"
        idAliases={['course_home_progress_slot']}
        pluginProps={{
          completionSummary,
          creditCourseRequirements,
          courseId,
          gradingPolicy,
          sectionScores,
          isStaff,
        }}
      >
      <ProgressHeader />
      <div className="row w-100 m-0">
        {/* Main body */}
        <div className="col-12 col-md-8 p-0">
          {!disableProgressGraph && <CourseCompletion />}
          <ProgressTabCertificateStatusMainBodySlot />
          <ProgressTabCourseGradeSlot />
          <ProgressTabGradeBreakdownSlot />
        </div>

        {/* Side panel */}
        <div className="col-12 col-md-4 p-0 px-md-4">
          <ProgressTabCertificateStatusSidePanelSlot />
          {/* <ProgressTabRelatedLinksSlot /> */}
        </div>
      </div>
      </PluginSlot>
    </div>
  );
};

export default ProgressTab;
