import StudentsPicker from "../components/StudentsPicker";
import StudentsTable from "../components/StudentsTable";
import {
  fetchStudentData,
  fetchSchoolData,
  fetchLegalguardianData,
} from "../utils";
import { useState } from "react";

const StudentsDataComponent = () => {
  const [studentsData, setStudentsData] = useState([]);
  const [schoolsData, setSchoolsData] = useState([]);
  const [legalguardiansData, setLegalguardiansData] = useState([]);

  const onStudentsPick = async (studentIds) => {
    const studentPromises = studentIds.map(async (studentId) => {
      const studentData = await fetchStudentData(studentId);
      const { schoolId, legalguardianId } = studentData;

      const [schoolData, legalguardianData] = await Promise.all([
        fetchSchoolData(schoolId),
        fetchLegalguardianData(legalguardianId),
      ]);

      return {
        studentData,
        schoolData,
        legalguardianData,
      };
    });

    const allData = await Promise.all(studentPromises);
    const updatedStudentsData = allData.map(({ studentData }) => studentData);
    const updatedSchoolsData = allData.map(({ schoolData }) => schoolData);
    const updatedLegalguardiansData = allData.map(
      ({ legalguardianData }) => legalguardianData
    );

    setStudentsData([...studentsData, ...updatedStudentsData]);
    setSchoolsData([...schoolsData, ...updatedSchoolsData]);
    setLegalguardiansData([
      ...legalguardiansData,
      ...updatedLegalguardiansData,
    ]);
  };

  return (
    <>
      <StudentsPicker onPickHandler={onStudentsPick} />
      <StudentsTable
        studentsData={studentsData}
        schoolsData={schoolsData}
        legalguardiansData={legalguardiansData}
      />
    </>
  );
};

export default StudentsDataComponent;
