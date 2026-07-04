/**
 * Skenario pengujian threadDetailSlice reducer:
 *
 * - optimisticVoteThread upvote: harus menambah upVotesBy dan menghapus dari downVotesBy
 * - optimisticVoteThread downvote: harus menambah downVotesBy dan menghapus dari upVotesBy
 * - optimisticVoteThread neutral: harus menghapus userId dari kedua array
 * - optimisticVoteComment: harus memperbarui vote pada comment yang tepat
 * - clearThreadDetail: harus mereset thread dan comments
 * - asyncGetThreadDetail.fulfilled: harus mengisi thread dan comments
 */

import threadDetailReducer, {
  clearThreadDetail,
  optimisticVoteThread,
  optimisticVoteComment,
  asyncGetThreadDetail,
} from './threadDetailSlice';

const sampleThread = {
  id: 'thread-1',
  title: 'Test Thread',
  body: 'Body',
  upVotesBy: [],
  downVotesBy: [],
  user: { id: 'user-1', name: 'John' },
};

const sampleComments = [
  {
    id: 'comment-1',
    content: 'Test comment',
    upVotesBy: [],
    downVotesBy: [],
    user: { id: 'user-2', name: 'Jane' },
  },
];

const initialState = {
  thread: null,
  comments: [],
  loading: false,
  error: null,
};

describe('threadDetailSlice reducer', () => {
  describe('optimisticVoteThread', () => {
    it('should handle upvote on a thread', () => {
      const state = {
        ...initialState,
        thread: { ...sampleThread, upVotesBy: [], downVotesBy: ['user-2'] },
      };
      const action = optimisticVoteThread({ userId: 'user-1', voteType: 'upvote' });
      const newState = threadDetailReducer(state, action);

      expect(newState.thread.upVotesBy).toContain('user-1');
      expect(newState.thread.upVotesBy).not.toContain('user-2');
    });

    it('should handle downvote on a thread', () => {
      const state = {
        ...initialState,
        thread: { ...sampleThread, upVotesBy: ['user-2'], downVotesBy: [] },
      };
      const action = optimisticVoteThread({ userId: 'user-1', voteType: 'downvote' });
      const newState = threadDetailReducer(state, action);

      expect(newState.thread.downVotesBy).toContain('user-1');
      expect(newState.thread.downVotesBy).not.toContain('user-2');
    });

    it('should remove previous opposite vote on upvote', () => {
      const state = {
        ...initialState,
        thread: { ...sampleThread, upVotesBy: [], downVotesBy: ['user-1'] },
      };
      const action = optimisticVoteThread({ userId: 'user-1', voteType: 'upvote' });
      const newState = threadDetailReducer(state, action);

      expect(newState.thread.upVotesBy).toContain('user-1');
      expect(newState.thread.downVotesBy).not.toContain('user-1');
    });

    it('should handle neutral vote on a thread', () => {
      const state = {
        ...initialState,
        thread: {
          ...sampleThread,
          upVotesBy: ['user-1'],
          downVotesBy: ['user-2'],
        },
      };
      const action = optimisticVoteThread({ userId: 'user-1', voteType: 'neutral' });
      const newState = threadDetailReducer(state, action);

      expect(newState.thread.upVotesBy).not.toContain('user-1');
      expect(newState.thread.downVotesBy).toContain('user-2');
    });

    it('should not duplicate userId in upVotesBy', () => {
      const state = {
        ...initialState,
        thread: { ...sampleThread, upVotesBy: ['user-1'], downVotesBy: [] },
      };
      const action = optimisticVoteThread({ userId: 'user-1', voteType: 'upvote' });
      const newState = threadDetailReducer(state, action);

      expect(newState.thread.upVotesBy).toEqual(['user-1']);
    });
  });

  describe('optimisticVoteComment', () => {
    it('should handle upvote on a comment', () => {
      const state = {
        ...initialState,
        comments: [JSON.parse(JSON.stringify(sampleComments[0]))],
      };
      const action = optimisticVoteComment({
        commentId: 'comment-1',
        userId: 'user-1',
        voteType: 'upvote',
      });
      const newState = threadDetailReducer(state, action);

      expect(newState.comments[0].upVotesBy).toContain('user-1');
    });

    it('should handle downvote on a comment', () => {
      const state = {
        ...initialState,
        comments: [JSON.parse(JSON.stringify(sampleComments[0]))],
      };
      const action = optimisticVoteComment({
        commentId: 'comment-1',
        userId: 'user-1',
        voteType: 'downvote',
      });
      const newState = threadDetailReducer(state, action);

      expect(newState.comments[0].downVotesBy).toContain('user-1');
    });
  });

  it('should handle clearThreadDetail', () => {
    const state = {
      thread: sampleThread,
      comments: sampleComments,
      loading: false,
      error: null,
    };
    const newState = threadDetailReducer(state, clearThreadDetail());

    expect(newState.thread).toBeNull();
    expect(newState.comments).toEqual([]);
  });

  it('should handle asyncGetThreadDetail.fulfilled', () => {
    const detail = {
      id: 'thread-1',
      title: 'Detail Thread',
      body: 'Body',
      upVotesBy: [],
      downVotesBy: [],
      owner: { id: 'user-1', name: 'John' },
      comments: [
        {
          id: 'comment-1',
          content: 'A comment',
          upVotesBy: [],
          downVotesBy: [],
          owner: { id: 'user-2', name: 'Jane' },
        },
      ],
    };
    const action = { type: asyncGetThreadDetail.fulfilled.type, payload: detail };
    const newState = threadDetailReducer(initialState, action);

    expect(newState.loading).toBe(false);
    expect(newState.thread).not.toBeNull();
    expect(newState.thread.user).toEqual(detail.owner);
    expect(newState.comments).toHaveLength(1);
    expect(newState.comments[0].user).toEqual(detail.comments[0].owner);
  });
});
