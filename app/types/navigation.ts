import { RouteProp } from "@react-navigation/native";

export type RootStackParamList = {
  Articles: undefined;
  ArticleDetail: { url: string };
};

export type ArticleDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "ArticleDetail"
>;
