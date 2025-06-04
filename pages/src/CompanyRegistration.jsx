import React from 'react';

export default function CompanyRegistration() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Company Registration</h1>
      <p>This is a minimal test to confirm React can render this page.</p>
      <form>
        <label htmlFor="companyName">Company Name</label>
        <br/>
        <input id="companyName" name="companyName" placeholder="Enter your company name" />
        <br/><br/>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
