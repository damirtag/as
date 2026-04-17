export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: string; output: string; }
};

export type CommentType = {
  __typename?: 'CommentType';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  quoteId: Scalars['ID']['output'];
  text: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['ID']['output'];
};

export type CreateCommentInput = {
  quoteId: Scalars['ID']['input'];
  text: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};

export type CreateQuoteInput = {
  text: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};

export type CreateReactionInput = {
  commentId?: InputMaybe<Scalars['ID']['input']>;
  quoteId: Scalars['ID']['input'];
  type: ReactionType;
  userId: Scalars['ID']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createCommentType: CommentType;
  createQuoteType: QuoteType;
  createReactionTypeGql: ReactionTypeGql;
  deleteCommentType: Scalars['Boolean']['output'];
  deleteQuoteType: Scalars['Boolean']['output'];
  deleteReactionTypeGql: Scalars['Boolean']['output'];
  updateCommentType: CommentType;
  updateQuoteType: QuoteType;
  updateReactionTypeGql: ReactionTypeGql;
};


export type MutationCreateCommentTypeArgs = {
  input: CreateCommentInput;
};


export type MutationCreateQuoteTypeArgs = {
  input: CreateQuoteInput;
};


export type MutationCreateReactionTypeGqlArgs = {
  input: CreateReactionInput;
};


export type MutationDeleteCommentTypeArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteQuoteTypeArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteReactionTypeGqlArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateCommentTypeArgs = {
  id: Scalars['ID']['input'];
  input: UpdateCommentInput;
};


export type MutationUpdateQuoteTypeArgs = {
  id: Scalars['ID']['input'];
  input: UpdateQuoteInput;
};


export type MutationUpdateReactionTypeGqlArgs = {
  id: Scalars['ID']['input'];
  input: UpdateReactionInput;
};

export type PaginatedCommentType = {
  __typename?: 'PaginatedCommentType';
  items: Array<CommentType>;
  limit: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PaginatedComments = {
  __typename?: 'PaginatedComments';
  items: Array<CommentType>;
  limit: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PaginatedQuoteType = {
  __typename?: 'PaginatedQuoteType';
  items: Array<QuoteType>;
  limit: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PaginatedQuotes = {
  __typename?: 'PaginatedQuotes';
  items: Array<QuoteType>;
  limit: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PaginatedReactionTypeGql = {
  __typename?: 'PaginatedReactionTypeGql';
  items: Array<ReactionTypeGql>;
  limit: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PaginatedReactions = {
  __typename?: 'PaginatedReactions';
  items: Array<ReactionTypeGql>;
  limit: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PaginatedUserType = {
  __typename?: 'PaginatedUserType';
  items: Array<UserType>;
  limit: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PaginationInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};

export type Query = {
  __typename?: 'Query';
  findCommentsByUserId: PaginatedComments;
  findOneCommentType: CommentType;
  findOneQuoteType: QuoteType;
  findOneReactionTypeGql: ReactionTypeGql;
  findOneUserType: UserType;
  findPaginatedCommentType: PaginatedCommentType;
  findPaginatedQuoteType: PaginatedQuoteType;
  findPaginatedReactionTypeGql: PaginatedReactionTypeGql;
  findPaginatedUserType: PaginatedUserType;
  findQuotesByUserId: PaginatedQuotes;
  findQuotesByUsername: PaginatedQuotes;
};


export type QueryFindCommentsByUserIdArgs = {
  pagination?: InputMaybe<PaginationInput>;
  userId: Scalars['ID']['input'];
};


export type QueryFindOneCommentTypeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFindOneQuoteTypeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFindOneReactionTypeGqlArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFindOneUserTypeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFindPaginatedCommentTypeArgs = {
  pagination: PaginationInput;
};


export type QueryFindPaginatedQuoteTypeArgs = {
  pagination: PaginationInput;
};


export type QueryFindPaginatedReactionTypeGqlArgs = {
  pagination: PaginationInput;
};


export type QueryFindPaginatedUserTypeArgs = {
  pagination: PaginationInput;
};


export type QueryFindQuotesByUserIdArgs = {
  pagination?: InputMaybe<PaginationInput>;
  userId: Scalars['ID']['input'];
};


export type QueryFindQuotesByUsernameArgs = {
  pagination?: InputMaybe<PaginationInput>;
  username: Scalars['String']['input'];
};

export type QuoteReactionsSummaryGql = {
  __typename?: 'QuoteReactionsSummaryGql';
  counts: Array<ReactionCountByTypeGql>;
  totalCount: Scalars['Int']['output'];
};

export type QuoteType = {
  __typename?: 'QuoteType';
  commentsPaginated: PaginatedComments;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  reactionsPaginated?: Maybe<PaginatedReactions>;
  reactionsSummary: QuoteReactionsSummaryGql;
  text: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['ID']['output'];
};


export type QuoteTypeCommentsPaginatedArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QuoteTypeReactionsPaginatedArgs = {
  includeUsers?: Scalars['Boolean']['input'];
  pagination?: InputMaybe<PaginationInput>;
};

export type ReactionCountByTypeGql = {
  __typename?: 'ReactionCountByTypeGql';
  count: Scalars['Int']['output'];
  type: ReactionType;
};

export enum ReactionType {
  Angry = 'Angry',
  Dislike = 'Dislike',
  Handshake = 'Handshake',
  Laugh = 'Laugh',
  Like = 'Like',
  Love = 'Love',
  Rofl = 'Rofl',
  Sad = 'Sad'
}

export type ReactionTypeGql = {
  __typename?: 'ReactionTypeGql';
  commentId?: Maybe<Scalars['ID']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  quoteId: Scalars['ID']['output'];
  type: ReactionType;
  userId: Scalars['ID']['output'];
};

export enum Role {
  Admin = 'ADMIN',
  User = 'USER'
}

export type UpdateCommentInput = {
  text?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateQuoteInput = {
  text?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateReactionInput = {
  type: ReactionType;
};

export type UserType = {
  __typename?: 'UserType';
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  role: Role;
  updatedAt: Scalars['DateTime']['output'];
  username: Scalars['String']['output'];
};

export type CreateCommentMutationVariables = Exact<{
  input: CreateCommentInput;
}>;


export type CreateCommentMutation = { __typename?: 'Mutation', createCommentType: { __typename?: 'CommentType', id: string, text: string, userId: string, createdAt: string } };

export type DeleteCommentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteCommentMutation = { __typename?: 'Mutation', deleteCommentType: boolean };

export type GetCommentsQueryVariables = Exact<{
  quoteId: Scalars['ID']['input'];
  pagination?: InputMaybe<PaginationInput>;
}>;


export type GetCommentsQuery = { __typename?: 'Query', findOneQuoteType: { __typename?: 'QuoteType', commentsPaginated: { __typename?: 'PaginatedComments', total: number, page: number, totalPages: number, items: Array<{ __typename?: 'CommentType', id: string, text: string, userId: string, createdAt: string }> } } };

export type CreateQuoteMutationVariables = Exact<{
  input: CreateQuoteInput;
}>;


export type CreateQuoteMutation = { __typename?: 'Mutation', createQuoteType: { __typename?: 'QuoteType', id: string, text: string, createdAt: string, userId: string } };

export type DeleteQuoteMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteQuoteMutation = { __typename?: 'Mutation', deleteQuoteType: boolean };

export type GetFeedQueryVariables = Exact<{
  pagination: PaginationInput;
}>;


export type GetFeedQuery = { __typename?: 'Query', findPaginatedQuoteType: { __typename?: 'PaginatedQuoteType', total: number, page: number, totalPages: number, items: Array<{ __typename?: 'QuoteType', id: string, text: string, createdAt: string, userId: string, reactionsSummary: { __typename?: 'QuoteReactionsSummaryGql', totalCount: number, counts: Array<{ __typename?: 'ReactionCountByTypeGql', type: ReactionType, count: number }> } }> } };

export type GetQuoteQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetQuoteQuery = { __typename?: 'Query', findOneQuoteType: { __typename?: 'QuoteType', id: string, text: string, createdAt: string, userId: string, reactionsSummary: { __typename?: 'QuoteReactionsSummaryGql', totalCount: number, counts: Array<{ __typename?: 'ReactionCountByTypeGql', type: ReactionType, count: number }> } } };

export type GetQuotesByUserQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
  pagination?: InputMaybe<PaginationInput>;
}>;


export type GetQuotesByUserQuery = { __typename?: 'Query', findQuotesByUserId: { __typename?: 'PaginatedQuotes', total: number, page: number, totalPages: number, items: Array<{ __typename?: 'QuoteType', id: string, text: string, createdAt: string }> } };

export type DeleteReactionMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteReactionMutation = { __typename?: 'Mutation', deleteReactionTypeGql: boolean };

export type ReactToQuoteMutationVariables = Exact<{
  input: CreateReactionInput;
}>;


export type ReactToQuoteMutation = { __typename?: 'Mutation', createReactionTypeGql: { __typename?: 'ReactionTypeGql', id: string, type: ReactionType, quoteId: string, userId: string } };

export type GetUserQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetUserQuery = { __typename?: 'Query', findOneUserType: { __typename?: 'UserType', id: string, username: string, name?: string | null, role: Role, createdAt: string } };

export type GetUsersQueryVariables = Exact<{
  pagination: PaginationInput;
}>;


export type GetUsersQuery = { __typename?: 'Query', findPaginatedUserType: { __typename?: 'PaginatedUserType', total: number, page: number, totalPages: number, items: Array<{ __typename?: 'UserType', id: string, username: string, role: Role, createdAt: string }> } };
