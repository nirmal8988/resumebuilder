// Initialize Quill editors for Skills and Projects
const quillSkills = new Quill('#skills-editor', {
    theme: 'snow',
    placeholder: 'List your skills here...'
  });
  quillSkills.root.innerHTML = `<ul><li>Data Analysis</li><li>Excel, SQL</li><li>Tableau</li></ul>`;
  
  const quillProjects = new Quill('#projects-editor', {
    theme: 'snow',
    placeholder: 'Describe your projects here...'
  });
  quillProjects.root.innerHTML = `<ul><li>Sales Data Dashboard</li><li>Customer Segmentation Analysis</li></ul>`;
  
  // Resume generation
  document.getElementById('resume-form').addEventListener('submit', function(e) {
    e.preventDefault();
  
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const summary = document.getElementById('summary').value.trim();
    const experience = document.getElementById('experience').value.trim();
    const education = document.getElementById('education').value.trim();
    const skills = quillSkills.root.innerHTML;
    const projects = quillProjects.root.innerHTML;
    const template = document.getElementById('template').value;
  
    // Handle profile picture file input
    const fileInput = document.getElementById('profilePic');
    const reader = new FileReader();
  
    reader.onload = function() {
      const profilePicURL = reader.result || '';
  
      // Build resume HTML with profile pic if provided
      const resumeHTML = `
        <div class="${template}">
          <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px;">
            ${profilePicURL ? `<img src="${profilePicURL}" alt="Profile Picture" style="width:100px; height:100px; border-radius:50%; object-fit:cover; border: 2px solid #ccc;">` : ''}
            <div>
              <h2>${name}</h2>
              <p><strong>Email:</strong> ${email}</p>
            </div>
          </div>
          <h4>Professional Summary</h4>
          <p>${summary.replace(/\n/g, '<br>')}</p>
          <h4>Experience</h4>
          <p>${experience.replace(/\n/g, '<br>')}</p>
          <h4>Education</h4>
          <p>${education.replace(/\n/g, '<br>')}</p>
          <h4>Skills</h4>
          ${skills}
          <h4>Projects</h4>
          ${projects}
        </div>
      `;
  
      document.getElementById('resume-preview').innerHTML = resumeHTML;
    };
  
    if (fileInput.files[0]) {
      reader.readAsDataURL(fileInput.files[0]);
    } else {
      reader.onload();
    }
  });
  
  // PDF Export using html2canvas + jsPDF
  async function downloadPDF() {
    const resumeElement = document.getElementById('resume-preview');
  
    if (!resumeElement.innerHTML.trim()) {
      alert('Please generate the resume first!');
      return;
    }
  
    // A4 size in pt (points) - 595 x 842 pts (width x height)
    const pdfWidth = 595;
    const pdfHeight = 842;
  
    // Render element to canvas at higher scale for quality
    const canvas = await html2canvas(resumeElement, { scale: 3 });
  
    // Calculate scale ratio to fit canvas into A4
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
  
    const ratioX = pdfWidth / canvasWidth;
    const ratioY = pdfHeight / canvasHeight;
  
    // Use minimum ratio to keep aspect ratio and fit inside A4
    const ratio = Math.min(ratioX, ratioY);
  
    const imgWidth = canvasWidth * ratio;
    const imgHeight = canvasHeight * ratio;
  
    const imgData = canvas.toDataURL('image/png');
  
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'pt', 'a4');
  
    // Center the image on the page if there's extra space
    const marginX = (pdfWidth - imgWidth) / 2;
    const marginY = (pdfHeight - imgHeight) / 2;
  
    pdf.addImage(imgData, 'PNG', marginX, marginY, imgWidth, imgHeight);
    pdf.save('resume.pdf');
  }
  