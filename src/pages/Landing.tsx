import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <main className="landing">
      <h1 className="title">coop<span className="title__suffix">dle</span></h1>
      <p className="tagline">
        A daily co-op puzzle for two. Get on a voice call, pick a side, and
        each device generates the same puzzles for today.
      </p>

      <div className="role-choices">
        <Link to="/solver/1" className="role-choice role-choice--solver">
          <span className="role-choice__label">Start as Solver</span>
          <span className="role-choice__desc">
            You see the puzzles. Describe what you see and follow your
            partner's instructions.
          </span>
        </Link>

        <Link to="/instructor/1" className="role-choice role-choice--instructor">
          <span className="role-choice__label">Start as Instructor</span>
          <span className="role-choice__desc">
            You hold the manual. Find the matching module and read out the
            rules.
          </span>
        </Link>
      </div>

      <p className="footnote">You'll swap sides for the second daily.</p>
    </main>
  )
}
