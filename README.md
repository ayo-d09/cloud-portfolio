

A personal portfolio website hosted on AWS that showcases my projects, technical skills, About Me section, and Contact page through a secure, scalable, and fully cloud-native deployment.

---

## Demo

[https://yourname.com](https://yourname.com)

---

## Architecture

The portfolio is deployed using a secure, CDN-backed architecture designed for high availability, low latency, and best-practice cloud security.

```
                        ┌─────────────┐
                        │   Route 53  │  - DNS Management
                        └──────┬──────┘
                               │
                        ┌──────v──────┐
                        │ CloudFront  │  - CDN / HTTPS / Caching
                        └──────┬──────┘
                               │
                        ┌──────v──────┐
                        │   S3 Bucket │  - Private Origin
                        │  (Static)   │
                        └─────────────┘
```

---

## AWS Services Used

**S3**: Stores static website files (HTML, CSS, JavaScript)
**CloudFront**: Global CDN for fast delivery and HTTPS enforcement 
**Route 53**:Ö DNS management for custom domain
**ACM**: SSL/TLS certififcate provisioning 
**IAM**: Secure access control (least privilege)
**CloudWatch**: Monitoring and alerting 


## Features

* Secure static website hosting using S3 (no public bucket access)
* Global content delivery via CloudFront
* Infrastructure provisioned with Terraform (IaC)
* Automated deployment using AWS CLI
* HTTPS enabled with SSL/TLS certificates
* Monitoring with CloudWatch
* Production-style cloud architecture

---

## Project Structure

```
cloud-portfolio/
│
├── website/              # Frontend files
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── terraform/            # Infrastructure as Code
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── provider.tf
│
├── deploy.sh             # Deployment script
├── README.md
```

---

## Setup & Deployment

### Prerequisites

* AWS CLI configured (`aws configure`)
* Terraform installed
* An AWS account with appropriate permissions

---

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/cloud-portfolio.git
cd cloud-portfolio
```

---

### 2. Initialize Terraform

```bash
cd terraform
terraform init
```

---

### 3. Deploy Infrastructure

```bash
terraform apply
```

This will provision:

* S3 bucket (private)
* CloudFront distribution
* IAM policies
* Supporting resources

---

### 4. Deploy Website

```bash
chmod +x deploy.sh
./deploy.sh
```

This uploads your website files to S3 and updates the live site.

---

## Security Best Practices

* S3 bucket is **not publicly accessible**
* Access is restricted using **CloudFront Origin Access Control (OAC)**
* IAM follows the **principle of least privilege**
* HTTPS enforced via CloudFront
* Sensitive configurations are not hardcoded

---

## Monitoring

CloudWatch is used for:

* Traffic monitoring
* Error tracking
* Alarm configuration

---

## What I Learned

* Designing secure and scalable cloud architectures
* Using Terraform for infrastructure as code
* Configuring CloudFront with private S3 origins
* Automating deployments with AWS CLI
* Troubleshooting real-world issues like access permissions and caching

---

## Future Improvements

* [ ] Add CI/CD pipeline (GitHub Actions)
* [ ] Configure custom domain with Route 53
* [ ] Enable access logging (S3 + CloudFront)
* [ ] Improve frontend UI/UX
* [ ] Add backend features (API Gateway + Lambda)

---

## Author

**Ayomide Obadina**
Cloud & DevOps Engineer

---

## Contact

* GitHub: 
* LinkedIn: 

---

## License

This project is licensed under the MIT License.
