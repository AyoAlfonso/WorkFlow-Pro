// import * as React from "react";
// import { color, space, typography } from "styled-system";
// import styled from "styled-components";
// import { MainContainer, HeadingContainer } from "~/components/shared/journals-and-notes";
// import { Heading } from "~/components/shared";
// import { useTranslation } from "react-i18next";

// export const Agenda = props => {
//   const { t } = useTranslation();

//   return (
//     <MainContainer>
//         <HeadingContainer>
//           <Heading type={"h1"} fontSize={"24px"}>
//             {t("meeting.meetingAgenda")}
//           </Heading>
//         </HeadingContainer>
//         <BodyContainer>
//           <FilterContainer>
//             <Card headerComponent={<CardHeaderText fontSize={"16px"}>Filter</CardHeaderText>}>
//               {renderDateFilterOptions()}
//               <DateRange
//                 showDateDisplay={false}
//                 showMonthAndYearPickers={false}
//                 ranges={[...Object.values(dateFilter)]}
//                 onChange={ranges => {
//                   setSelectedDateFilter("");
//                   handleDateSelect(ranges);
//                 }}
//                 showSelectionPreview={true}
//                 direction={"vertical"}
//                 minDate={addDays(new Date(), -90)}
//                 maxDate={new Date()}
//                 scroll={{
//                   enabled: true,
//                   calendarWidth: 320,
//                   monthWidth: 320,
//                 }}
//                 rangeColors={[baseTheme.colors.primary80]}
//               />
//             </Card>
//           </FilterContainer>
//           <ItemListContainer>{renderItems()}</ItemListContainer>
//           <EntryContainer>{renderSelectedEntry()}</EntryContainer>
//         </BodyContainer>
//       </MainContainer>
//   )

// }
