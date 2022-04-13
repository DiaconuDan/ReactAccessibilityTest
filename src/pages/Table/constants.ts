export const MAX_LIMIT_DATA_COUNT = 20;

export const API = 'https://swapi.dev/api/people' ;

export const mapDatatoTableFields = (data: any) => {
  return data.map((element: any, index: number) => {
    const { name, gender, height } = element;

    return {
      key: index,
      name,
      gender,
      height,
    };
  });
};
