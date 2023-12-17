import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  display: flex;
  min-width: 400px;
  height: calc(100% - 125px);
`;
export const LeftWrapper = styled.div`
  width: 50%;
  height: 100%;
  border: 1px solid #d5d5d5;
  text-align: left;
  max-width: 750px;
`;

export const RightWrapper = styled.div`
  width: 30%;
  height: 100%;
  min-width: 700px;
  margin-left: 30px;
`;
export const ImageWrapper = styled.img``;
export const HREFButton = styled.a`
  &:hover {
    color: red;
    cursor: pointer;
  }
`;
export const ListItem = styled.tr`
  width: 100%;
  height: 40px;
  // text-align: center;
  // display: flex;
  // justify-content: center;
  // align-items: center;
  &:hover {
    color: red;
    cursor: pointer;
    background: rgba(120, 120, 120, 0.1);
  }
`;
