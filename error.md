Тип "CreateSubjectDto" не может быть назначен для типа "(Without<SubjectCreateInput, SubjectUncheckedCreateInput> & SubjectUncheckedCreateInput) | (Without<...> & SubjectCreateInput)".
  Тип "CreateSubjectDto" не может быть назначен для типа "Without<SubjectUncheckedCreateInput, SubjectCreateInput> & SubjectCreateInput".
    Свойство "title" отсутствует в типе "CreateSubjectDto" и является обязательным в типе "SubjectCreateInput".

  Здесь объявлен "title".
  
  Ожидаемый тип поступает из свойства "data", объявленного здесь в типе "{ select?: SubjectSelect<DefaultArgs> | null | undefined; omit?: SubjectOmit<DefaultArgs> | null | undefined; include?: SubjectInclude<...> | ... 1 more ... | undefined; data: (Without<...> & SubjectUncheckedCreateInput) | (Without<...> & SubjectCreateInput); }"