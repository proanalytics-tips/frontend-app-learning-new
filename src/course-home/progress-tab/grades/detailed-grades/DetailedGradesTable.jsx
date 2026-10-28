import { getLocale, isRtl, useIntl } from '@edx/frontend-platform/i18n';
import { DataTable } from '@openedx/paragon';
import { useContextId } from '../../../../data/hooks';

import { useModel } from '../../../../generic/model-store';
import messages from '../messages';
import SubsectionTitleCell from './SubsectionTitleCell';
import { getSubsectionScore, hasSubsectionAssignments } from '../../utils';
import './DetailedGradesTable.scss';

const DetailedGradesTable = () => {
  const intl = useIntl();
  const courseId = useContextId();

  const {
    sectionScores,
  } = useModel('progress', courseId);

  const isLocaleRtl = isRtl(getLocale());
  const safeSectionScores = sectionScores ?? [];
  return (
    safeSectionScores.map((chapter) => {
      const subsectionScores = (chapter.subsections ?? []).filter(
        // Keep practice and pending homework, but omit lectures without assignments.
        (subsection) => !!subsection.showGrades && hasSubsectionAssignments(subsection),
      );

      if (subsectionScores.length === 0) {
        return null;
      }

      const detailedGradesData = subsectionScores.map((subsection) => {
        const score = getSubsectionScore(subsection);
        const formatPoints = (value) => String(Number(value.toFixed(1)));
        return {
          subsectionTitle: <SubsectionTitleCell subsection={subsection} />,
          score: <span className={subsection.learnerHasAccess ? '' : 'greyed-out'}>{formatPoints(score.earned)}{isLocaleRtl ? '\\' : '/'}{formatPoints(score.possible)}</span>,
        };
      });

      return (
        <div className="my-3 detailed-grades-table" key={`${chapter.displayName}-grades-table`}>
          <DataTable
            data={detailedGradesData}
            itemCount={detailedGradesData.length}
            columns={[
              {
                Header: chapter.displayName,
                accessor: 'subsectionTitle',
                headerClassName: 'h5 mb-0',
                cellClassName: 'mw-100',
              },
              {
                Header: `${intl.formatMessage(messages.score)}`,
                accessor: 'score',
                headerClassName: 'justify-content-end h5 mb-0',
                cellClassName: 'align-top text-right small',
              },
            ]}
          >
            <DataTable.Table />
          </DataTable>
        </div>
      );
    })
  );
};

export default DetailedGradesTable;
